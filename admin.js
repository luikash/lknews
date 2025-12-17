// Admin Key

const admin_key = document.getElementById("admin_key");

function save_admin_key() {
    localStorage.setItem("admin_key", admin_key.value);
}

function clear_admin_key() {
    localStorage.removeItem("admin_key");
    admin_key.value = "";
}

admin_key.value = localStorage.getItem("admin_key");

// Tabs

const publish_tab = document.getElementById("publish_tab");
const manage_tab = document.getElementById("manage_tab");
const publish_tab_button = document.getElementById("show_publish_tab");
const manage_tab_button = document.getElementById("show_manage_tab");

function show_publish_tab() {
    manage_tab_button.textContent = "Manage";
    publish_tab_button.textContent = "[Publish]";
    manage_tab.hidden = true;
    publish_tab.hidden = false;

    localStorage.removeItem("manage-tab");
}

function show_manage_tab() {
    publish_tab_button.textContent = "Publish";
    manage_tab_button.textContent = "[Manage]";
    publish_tab.hidden = true;
    manage_tab.hidden = false;

    localStorage.setItem("manage-tab", "true")
}

if (localStorage.getItem("manage-tab") == "true") {
    show_manage_tab();
}

// Publish

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
        clear_content();
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

// Manage

let news;

const recent = document.getElementById("recent");
const more = document.getElementById("load_more");
const more_button = document.getElementById("load_more_button");
const close_button = document.getElementById("close_more_button");

async function delete_article(article_id) {
    const article = document.getElementById("article-"+article_id);
    const delete_button = document.getElementById(`delete_${article_id}_button`);
    const delete_result = document.getElementById(`delete_${article_id}_result`);
    delete_button.disabled = true;

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
                    delete: article_id
                }
            }
        })
    });

    if (req.ok) {
        delete_result.textContent = "Success!";
        delete_result.appendChild(document.createElement("br"));
        delete news.news[article_id];
        news.keys.splice(news.keys.indexOf(article_id), 1);
        article.remove()
    } else {
        delete_result.textContent = "Error ";
    }
    delete_result.hidden = false;
    setTimeout(function () {
        if (req.ok) {
            delete_result.remove();
        } else {
            delete_result.hidden = true;
            delete_button.disabled = false;
        }
    }, 1000);
}

function load_more(isFirst) {
    if (!news) { return };
    if (news.start < 0) { return };
    const end = Math.max(-1, news.start - 10);
    for (let i = news.start; i > end; i--) {
        const key = news.keys[i];
        let v = news.news[key];
        const item = document.createElement("span");
        item.id = "article-" + key;
        const del_button = document.createElement("button");
        del_button.textContent = "Delete";
        del_button.id = `delete_${key}_button`;
        del_button.setAttribute("onclick", `delete_article("${key}")`);
        item.appendChild(del_button);
        const delete_result = document.createElement("span");
        delete_result.id = `delete_${key}_result`;
        delete_result.hidden = true;
        recent.appendChild(delete_result);
        const date = document.createElement("span");
        date.textContent += " " + v.date + " - ";
        item.appendChild(date);
        const ref = document.createElement("a");
        ref.href = "view.html?manage=true&id=" + key;
        ref.textContent = v.title;
        item.appendChild(ref);
        item.appendChild(document.createElement("br"));
        recent.appendChild(item);
    }
    news.start = end;
    if (isFirst) {
        close_button.hidden = true;
    } else {
        close_button.hidden = false;
    }
    if (news.start < 0) {
        more_button.hidden = true;
    } else {
        more.hidden = false;
        more_button.hidden = false;
    }
}

async function load_first(notFirst) {
    if (notFirst) {
        news.start = news.keys.length - 1;
    } else {
        let req = await fetch("info.json");
        let data = await req.json();

        req = await fetch(data.news_source + "news.json" + `?cc=${Math.random()*Number.MAX_SAFE_INTEGER}`);
        data = await req.json();
        let keys = Object.keys(data);

        news = {
            "news": data,
            "keys": keys,
            "start": keys.length - 1
        };
    }

    load_more(true);
}
load_first();

function close_more() {
    recent.innerHTML = "";
    more.hidden = true;
    load_first(true);
}