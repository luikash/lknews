function get_date() {
    const date = new Date();
    let month = (date.getUTCMonth()+1).toString();
    let day = date.getUTCDate().toString();
    let year = date.getUTCFullYear().toString().slice(2);
    if (month.length == 1) {
        month = '0' + month;
    }
    if (day.length == 1) {
        day = '0' + day;
    }
    return `${month}/${day}/${year}`
}

async function setup(id, isPreview) {
    if (isPreview) {
        const publish_title = localStorage.getItem("publish_title");
        const publish_content = localStorage.getItem("publish_content");
        const publish_date = get_date();

        document.title = publish_content + " - LKNews";
        document.getElementById("headline").textContent = publish_title + " - " + publish_date;

        const converter = new showdown.Converter();
        document.getElementById("content").innerHTML = converter.makeHtml(publish_content);
        
        document.getElementById("homeref").hidden = true;
        document.getElementById("backref").hidden = false;
    } else {
        let req = await fetch("info.json");
        let data = await req.json();

        req = await fetch(data.news_source + "articles/" + id + ".json" + `?cc=${Math.random()*Number.MAX_SAFE_INTEGER}`);
        if (!req.ok) {
            document.title = "Error"
            document.getElementById("headline").textContent = `Failed to load article \`${id}\``;
            return;
        }
        data = await req.json();

        document.title = data.title + " - LKNews";
        document.getElementById("headline").textContent = data.title + " - " + data.date;
        
        const converter = new showdown.Converter();
        document.getElementById("content").innerHTML = converter.makeHtml(data.content);
    }
}

const queryStr = window.location.search;
const urlParams = new URLSearchParams(queryStr);
const id = urlParams.get("id");
const isPreview = urlParams.get("preview") == "true";
setup(id, isPreview);