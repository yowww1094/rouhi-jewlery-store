import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getGoogleSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  privateKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error('Google Service Account credentials missing in environment variables');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: SCOPES,
  });

  const client = await auth.getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sheets = google.sheets({ version: 'v4', auth: client as any });
  
  return sheets;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function appendOrderToSheet(orderData: any) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      console.warn('GOOGLE_SHEET_ID not configured. Skipping sheets sync.');
      return;
    }

    const sheets = await getGoogleSheetsClient();
    
    // Format products list into a single string for the sheet cell
    const productsString = orderData.items.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => `${item.quantity}x ${item.name_fr} (${item.material})`
    ).join(' | ');

    const values = [
      [
        orderData.orderNumber,
        new Date(orderData.createdAt || Date.now()).toLocaleString('en-GB'),
        orderData.customer?.fullName || orderData.customer?.name || '',
        orderData.customer?.phone || '',
        orderData.customer.city,
        orderData.customer.address,
        productsString,
        orderData.totalAmount.toFixed(2),
        orderData.status,
        orderData.notes || '',
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:J', // Assumes a sheet named "Orders"
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    
    console.log(`Successfully synced order ${orderData.orderNumber} to Google Sheets`);
  } catch (error) {
    // We log but don't throw because Sheets sync is secondary to DB
    console.error('Failed to append order to Google Sheets:', error);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function syncAllOrdersToSheet(ordersData: any[]) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    const sheets = await getGoogleSheetsClient();
    
    const headers = [
      'Order ID', 'Date', 'Customer Name', 'Phone', 'City', 'Address', 'Products', 'Total Amount', 'Status', 'Notes'
    ];

    const values = ordersData.map(orderData => {
      const productsString = orderData.items.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => `${item.quantity}x ${item.name_fr || 'Product'} (${item.material})`
      ).join(' | ');

      return [
        orderData.orderNumber,
        new Date(orderData.createdAt || Date.now()).toLocaleString('en-GB'),
        orderData.customer?.fullName || orderData.customer?.name || '',
        orderData.customer?.phone || '',
        orderData.customer?.city || '',
        orderData.customer?.address || '',
        productsString,
        (orderData.totalAmount || 0).toFixed(2),
        orderData.status || '',
        orderData.notes || '',
      ];
    });

    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Orders!A:J',
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Orders!A:J',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers, ...values],
      },
    });

    // Add Data Validation (Dropdown) to Status Column (Column I, index 8)
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheet = spreadsheet.data.sheets?.find(s => s.properties?.title === 'Orders');
    const sheetId = sheet?.properties?.sheetId || 0;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: sheetId,
                startRowIndex: 1, // Skip header
                startColumnIndex: 8, // Column I
                endColumnIndex: 9,
              },
              rule: {
                condition: {
                  type: 'ONE_OF_LIST',
                  values: [
                    { userEnteredValue: 'Pending' },
                    { userEnteredValue: 'Confirmed' },
                    { userEnteredValue: 'Processing' },
                    { userEnteredValue: 'Delivered' },
                    { userEnteredValue: 'Cancelled' }
                  ]
                },
                showCustomUi: true,
                strict: true
              }
            }
          }
        ]
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to sync all orders to Google Sheets:', error);
    throw error;
  }
}

export async function pullStatusesFromSheet() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEET_ID not configured');
    }

    const sheets = await getGoogleSheetsClient();
    
    // Read the Orders sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Orders!A:J', // We need A (Order ID) and I (Status, 8th index)
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return { success: true, updatedCount: 0 };
    }

    // Skip header row
    const orderRows = rows.slice(1);
    
    const updates = orderRows.map((row) => ({
      orderNumber: row[0], // Column A
      status: row[8],      // Column I
    })).filter(row => row.orderNumber && row.status);

    return { success: true, updates };
  } catch (error) {
    console.error('Failed to pull statuses from Google Sheets:', error);
    throw error;
  }
}
