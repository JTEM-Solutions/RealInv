var socket = io();

let s_store;
let ui_state = 0;

function init() {
    document.getElementById('re_panel').style.display = "none";

    if (localStorage.getItem('s_m_id') === undefined)
        return;
    socket.emit('s_check', {id:localStorage.getItem('s_m_id')});
}

function li_submit() {

}
function ui_switch() {
    if (ui_state === 0) {
        document.getElementById('li_panel').style.display = "none";
        document.getElementById('re_panel').style.display = "block";
        ui_state = 1;
    } else {
        document.getElementById('li_panel').style.display = "block";
        document.getElementById('re_panel').style.display = "none";
        ui_state = 1;
    }
}

socket.on('s_check_r', function(data) {
    if (data.status)
        location.href = s_store.s_url;
});

socket.on('pack', function(data) {
    s_store = data;
    document.getElementById('theme').href = "style/" + s_store.st_theme + ".css";
    document.title = "" + s_store.s_name + " - Login";
});