async function setup(id) {
    let req = await fetch("info.json");
    let data = await req.json();

    req = await fetch(data.news_source + "articles/" + id + ".json", {"cache": "no-cache"});
    if (!req.ok) {
        document.getElementById("headline").textContent = `Failed to load article "${id}"`;
        return;
    }
    data = await req.json();

    document.getElementById("headline").textContent = data.title + " - " + data.date;
    
    const converter = new showdown.Converter();
    document.getElementById("content").innerHTML = converter.makeHtml(data.content);
}

const queryStr = window.location.search;
const urlParams = new URLSearchParams(queryStr);
const id = urlParams.get("id");
setup(id)