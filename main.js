let news;

const recent = document.getElementById("recent");
const more = document.getElementById("load_more");

function load_more() {
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
    if (news.start < 0) {
        more.hidden = true;
    } else {
        more.hidden = false;
    }
}

async function load_first() {
    let req = await fetch("info.json");
    let data = await req.json();

    req = await fetch(data.news_source + "news.json");
    data = await req.json();
    let keys = Object.keys(data);

    news = {
        "news": data,
        "keys": keys,
        "start": keys.length - 1
    };
    //3

    load_more();
}
load_first();