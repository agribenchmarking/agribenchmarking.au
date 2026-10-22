const choice = "ahb_cookie_choice";
const bar = document.getElementById("cookie-bar");
const acceptButton = document.getElementById("cookie-accept");

function alreadyAccepted() {
  return document.cookie.split("; ").includes(`${choice}=accepted`);
}

function showNotice() {
  if (!bar || alreadyAccepted()) return;
  bar.hidden = false;
  document.body.classList.add("has-cookie-bar");
}

function acceptCookies() {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `ahb_cookie_choice=accepted; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  if (bar) bar.hidden = true;
  document.body.classList.remove("has-cookie-bar");
}

showNotice();
acceptButton?.addEventListener("click", acceptCookies);
