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
function re_submit() {
    let uName = document.getElementById('re_uName').value;
    let uEmail = document.getElementById('re_uEmail').value;
    let uPass = document.getElementById('re_uPass').value;

    let eText = document.getElementById('re_errorText');

    if (uName.length > 56 || uName.length < 3) {
        eText.style.display = "block";
        eText.innerHTML = "Uesrname must be 3 to 56 characters.";
        return;
    }
    if (uEmail.length > 72 || !uEmail.includes("@")) {
        eText.style.display = "block";
        eText.innerHTML = "Invalid email.";
        return;
    }
    if (uPass.length > 56) {
        eText.style.display = "block";
        eText.innerHTML = "Invalid password.";
        return;
    }

    socket.emit('register', {uName:uName, uEmail:uEmail, uPass:uPass});
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
function re_checkbox_click() {
    let cBox = document.getElementById("re_checkbox");
    if (cBox.innerHTML === "X")
        cBox.innerHTML = " ";
    else
        cBox.innerHTML = "X";
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