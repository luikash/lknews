let news;

const recent = document.getElementById("recent");
const more = document.getElementById("load_more");
const more_button = document.getElementById("load_more_button");
const close_button = document.getElementById("close_more_button");

function load_more(isFirst) {
    if (!news) { return };
    if (news.start < 0) { return };
    const end = Math.max(-1, news.start - 10);
    for (let i = news.start; i > end; i--) {
        let v = news.news[news.keys[i]];
        const item = document.createElement("span");
        item.textContent += v.date + " - ";
        const ref = document.createElement("a");
        ref.href = "view.html?id=" + news.keys[i];
        ref.textContent = v.title;
        item.appendChild(ref);
        recent.appendChild(item);
        recent.innerHTML += "<br>";
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
        let req = await fetch("info.json" + `?cc=${Math.random()*Number.MAX_SAFE_INTEGER}`);
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