/**
 * locketql_merged_fixed.js
 * Unlock Locket Gold với ngày động
 * - Giữ đúng product_identifier chuẩn của Locket
 * - Entitlement key = "Gold"
 * - purchase_date luôn = ngày hiện tại
 */

const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip', 'com.xunn.premium.yearly'],
  'Locket': ['Gold', 'com.xunn.premium.yearly']
};

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
  product_identifier: "com.xunn.premium.yearly", // 👈 chuẩn
  expires_date: "2099-12-31T23:59:59Z"
};

// Mapping theo UA
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0] || "Gold";
  let subscriptionKey = mapping[match][1] || "com.xunn.premium.yearly";

  obj.subscriber.subscriptions[subscriptionKey] = xunn;
  obj.subscriber.entitlements[entitlementKey] = xunn_entitlement;
} else {
  obj.subscriber.subscriptions["com.xunn.premium.yearly"] = xunn;
  obj.subscriber.entitlements["Gold"] = xunn_entitlement;
}

// Thông điệp
obj.Attention = "Bạn đang dùng bản Locket Gold (script merged).";

// Log debug
console.log("User-Agent:", ua);
console.log("Modified Response:", JSON.stringify(obj, null, 2));

$done({ body: JSON.stringify(obj) });
