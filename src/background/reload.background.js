function reloadDashboard() {
    document.getElementById('dashboard').src = "";
    document.getElementById('dashboard').src = "https://theshownation.com/mlb20/dashboard";
}
setInterval(reloadDashboard, 60 * 1000)