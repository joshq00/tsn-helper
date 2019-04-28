function reloadDashboard() {
    document.getElementById('dashboard').src = "";
    document.getElementById('dashboard').src = "https://mlb19.theshownation.com/dashboard";
}
setInterval(reloadDashboard, 60 * 1000)