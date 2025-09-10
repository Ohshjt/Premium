/**
 * locketql_merged.js
 * Unlock Locket Gold với ngày động
 * - Giữ nguyên logic mapping từ locketql.js
 * - purchase_date luôn = ngày hiện tại (hiện đúng trong UI)
 * - expires_date đặt xa (2099-12-31)
 */

const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

// User-Agent lấy từ request
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

let obj = {};
try {
  obj = JSON.parse($response.body);
} catch (e) {
  console.log("Error parsing response body:", e);
  $done({});
}

if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

// Ngày hiện tại (ISO 8601)
let now = new Date().toISOString();

// Subscription giả lập
var xunn = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-31T23:59:59Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2023-01-01T00:00:00Z",
  purchase_date: now,
  store: "app_store"
};

// Entitlement giả lập
var xunn_entitlement = {
  grace_period_expires_date: null,
  purchase_date: now,
  product_identifier: "com.xunn.premium.yearly",
  expires_date: "2099-12-31T23:59:59Z"
};

// Mapping theo UA
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0] || "Locket";
  let subscriptionKey = mapping[match][1] || "com.xunn.premium.yearly";

  obj.subscriber.subscriptions[subscriptionKey] = xunn;
  obj.subscriber.entitlements[entitlementKey] = xunn_entitlement;
} else {
  obj.subscriber.subscriptions["com.hoangvanbao.premium.yearly"] = xunn;
  obj.subscriber.entitlements["Locket"] = xunn_entitlement;
}

// Thông điệp cảnh báo
obj.Attention = "Chúc mừng bạn khọ khọ khọ! Vui lòng không bán hoặc chia sẻ cho người khác!";

// Log để debug
console.log("User-Agent:", ua);
console.log("Final Modified Response:", JSON.stringify(obj, null, 2));

$done({ body: JSON.stringify(obj) });
