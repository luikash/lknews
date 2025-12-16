const admin_key = document.getElementById("admin_key");

function save_admin_key() {
    localStorage.setItem("admin_key", admin_key.value);
}

function clear_admin_key() {
    localStorage.removeItem("admin_key");
    admin_key.value = "";
}

admin_key.value = localStorage.getItem("admin_key");

const publish_tab = document.getElementById("publish_tab");
const manage_tab = document.getElementById("manage_tab");
const publish_tab_button = document.getElementById("show_publish_tab");
const manage_tab_button = document.getElementById("show_manage_tab");

function show_publish_tab() {
    manage_tab_button.textContent = "Manage";
    publish_tab_button.textContent = "[Publish]";
    manage_tab.hidden = true;
    publish_tab.hidden = false;
}

function show_manage_tab() {
    publish_tab_button.textContent = "Publish";
    manage_tab_button.textContent = "[Manage]";
    publish_tab.hidden = true;
    manage_tab.hidden = false;
}

const input_title = document.getElementById("input_title");
const input_content = document.getElementById("input_content");

function save_content() {
    localStorage.setItem("publish_title", input_title.value);
    localStorage.setItem("publish_content", input_content.value);
}

function clear_content() {
    localStorage.removeItem("publish_title");
    localStorage.removeItem("publish_content");
    input_title.value = "";
    input_content.value = "";
}

function preview_content() {
    save_content()
    window.open("view.html?preview=true", "_self");
}

const publish_button = document.getElementById("publish_button");
const publish_result = document.getElementById("publish_result");
async function publish_content() {
    publish_button.disabled = true;

    const publish_title = input_title.value;
    const publish_content = input_content.value;
    clear_content();

    let req = await fetch("info.json");
    let data = await req.json();

    req = await fetch(data.workflows_endpoint, {
        method: "POST",
        headers: {
            Authorization: `token ${admin_key.value}`
        },
        body: JSON.stringify({
            event_type: "publish-article",
            client_payload: {
                ref: "refs/heads/main",
                inputs: {
                    title: publish_title,
                    content: publish_content
                }
            }
        })
    });

    if (req.ok) {
        publish_result.textContent = "Success!";
    } else {
        publish_result.textContent = "Error";
    }
    publish_result.hidden = false;
    setTimeout(function () {
        publish_result.hidden = true;
        publish_button.disabled = false;
    }, 3000);
}

input_title.value = localStorage.getItem("publish_title");
input_content.value = localStorage.getItem("publish_content");