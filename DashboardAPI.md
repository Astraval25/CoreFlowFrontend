{{astraval.com}}/api/companies/{{companyId}}/analytics/dashboard/kpi?startDate=2025-05-01&endDate=2026-04-30
{
  "responseStatus": true,
  "responseCode": 200,
  "responseMessage": "Dashboard KPI retrieved",
  "responseData": {
    "totalRevenue": 2220.0,
    "totalExpense": 12416.0,
    "netProfit": -10196.0,
    "totalSalesOrders": 3,
    "totalPurchaseOrders": 6,
    "totalPaymentsReceived": 2,
    "totalPaymentsMade": 6,
    "avgOrderValue": 1626.2222222222222,
    "outstandingReceivables": 480.0,
    "outstandingPayables": 0.0
  }
}
{{astraval.com}}/api/companies/{{companyId}}/analytics/dashboard/cash-flow?startDate=2025-05-01&endDate=2026-04-30
{
  "responseStatus": true,
  "responseCode": 200,
  "responseMessage": "Cash flow retrieved",
  "responseData": [
    {
      "month": "2025-05",
      "openingBalance": 0.0,
      "incoming": 0.0,
      "outgoing": 0.0,
      "closingBalance": 0.0
    },.....
    {
      "month": "2026-04",
      "openingBalance": -10676.0,
      "incoming": 0.0,
      "outgoing": 0.0,
      "closingBalance": -10676.0
    },
    {
      "month": "2026-05",
      "openingBalance": -10676.0,
      "incoming": 0.0,
      "outgoing": 0.0,
      "closingBalance": -10676.0
    }
  ]
}
{{astraval.com}}/api/companies/{{companyId}}/analytics/dashboard/revenue-expense?startDate=2025-05-01&endDate=2026-04-30
{
  "responseStatus": true,
  "responseCode": 200,
  "responseMessage": "Revenue vs expense retrieved",
  "responseData": [
    {
      "month": "2025-05",
      "revenue": 0.0,
      "expense": 0.0,
      "netProfit": 0.0,
      "runningRevenue": 0.0,
      "runningExpense": 0.0,
      "runningNetProfit": 0.0
    },.....
    {
      "month": "2026-05",
      "revenue": 0.0,
      "expense": 0.0,
      "netProfit": 0.0,
      "runningRevenue": 2220.0,
      "runningExpense": 12416.0,
      "runningNetProfit": -10196.0
    }
  ]
}

