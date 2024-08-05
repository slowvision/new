// Function to search error codes
function searchCode() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Collapsible Details functionality with smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.collapsible').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                button.textContent = "Details";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                button.textContent = "Hide Details";
            }
        });
    });
});