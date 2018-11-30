var socket = io();

let s_store;
let li_state = 0;

function init() {
    socket.emit('s_check', {id:localStorage.getItem('s_m_id')});
}
function h_li_click() {
    if (li_state === 0)
        location.href = "login";
    else {
        //TODO log the user out.
    }
}

socket.on('pack', function(data) {
    s_store = data;
    document.getElementById('theme').href = "style/" + s_store.st_theme + ".css";
    document.title = "" + s_store.s_name + " - Home";
});
socket.on('s_check_r', function(data) {
    if (data.status) {
        document.getElementById('h_li_text').innerHTML = "Logout";
        li_state = 1;
    }
});