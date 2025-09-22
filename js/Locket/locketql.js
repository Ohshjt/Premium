var specificDate = "2025-09-22T00:00:00Z"; 

const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold'] 
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

try {
  var obj = JSON.parse($response.body);
} catch (e) {
  console.log("Error parsing response body:", e);
  $done({}); 
}

if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

var xunn = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-18T01:04:17Z", 
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: specificDate,  
  purchase_date: specificDate,          
  store: "app_store"
};

var xunn_entitlement = {
  grace_period_expires_date: null,
  purchase_date: specificDate, 
  product_identifier: "com.xunn.premium.yearly",
  expires_date: "2099-12-18T01:04:17Z" 
};

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

obj.Attention = "Chúc mừng bạn Xunn! Vui lòng không bán hoặc chia sẻ cho người khác!";
console.log("User-Agent:", ua);
console.log("Final Modified Response:", JSON.stringify(obj, null, 2));

$done({ body: JSON.stringify(obj) });
