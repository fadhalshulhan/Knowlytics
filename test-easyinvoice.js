require('dotenv').config();
const easyinvoice = require('easyinvoice');
const fs = require('fs').promises;

async function testInvoice() {
    const data = {
        apiKey: process.env.EASYINVOICE_API_KEY,
        mode: "development",
        sender: { company: "Test", address: "123 Test St", city: "Test City", country: "Test Country" },
        client: { company: "Client", address: "456 Client St", city: "Client City", country: "Client Country" },
        information: { number: "TEST-001", date: "2025-04-09", dueDate: "2025-04-24" },
        products: [{ quantity: 1, description: "Test Product", price: 10 }],
        bottomNotice: "Kindly pay your invoice within 15 days."
    };

    try {
        const result = await easyinvoice.createInvoice(data);
        await fs.writeFile('test-invoice.pdf', result.pdf, 'base64');
        console.log('Invoice created successfully');
    } catch (error) {
        console.error('Error:', error);
    }
}

testInvoice();