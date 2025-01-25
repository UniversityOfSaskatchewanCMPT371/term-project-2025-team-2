
// test function
document.getElementById("text").textContent = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-250px"; // Close sidebar
    } else {
        sidebar.style.right = "0px"; // Open sidebar
    }
}

