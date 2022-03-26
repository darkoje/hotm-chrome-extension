let hotm_os_assets = "https://opensea.io/assets/0x8a9ece9d8806eb0cde56ac89ccb23a36e2c718cf/";
let api_url = "https://api.kriptorog.org/hotm/";
let hotm_os_collection = "https://opensea.io/collection/humans-metaverse";

// my opensea custom url change listener
let currentPage = location.href;
setInterval(function()
{
    if (currentPage != location.href)
    {
        currentPage = location.href;
        location.reload();
    }
}, 500);

// current address and scroll position
const current_address = document.URL;
var scroll_position = document.documentElement.scrollTop;

// process single nft view (asset)
if (current_address.startsWith(hotm_os_assets)){
    let human_url = document.URL;
    let id = human_url.replace(hotm_os_assets, "");
    below_title = document.getElementsByClassName("item--header")[0];
    url = api_url + id;

    fetch(url)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let job = data['job'];

        // hardcoded shortener so UI doesn't break on too long names
        if (job.includes("Human Resources Specialist")){
            job = "HR Specialist";
        }

        below_title.append(job + ": " + data['unclaimed'] + " $hotm");
    })
    .catch((error) => {
       console.log(error)
    })
}

// NFT listings/activity views
if (current_address.startsWith(hotm_os_collection + "?tab=activity")){

    const interval = setInterval(function() {
        let next_scroll_position = document.documentElement.scrollTop;
        if (scroll_position != next_scroll_position){
            let listings = document.body.getElementsByClassName("AssetCell--container");
            for (let listing of listings) {
                getHumanListed(listing);
            }
            scroll_position = next_scroll_position;
        }
     }, 3000);
}

// NFT collection views
if ((current_address == hotm_os_collection) || current_address.startsWith(hotm_os_collection + "?search")) {

    //trigger once
    let articles = document.body.getElementsByTagName("article");
    for (let article of articles) {
        getHuman(article);
    }

    // trigger in intervals
     const interval = setInterval(function() {
        let next_scroll_position = document.documentElement.scrollTop;
        if (scroll_position != next_scroll_position){

            let articles = document.body.getElementsByTagName("article");
            for (let article of articles) {
                getHuman(article);
            }
            scroll_position = next_scroll_position;
        }
     }, 3000);
}

// process listings/activity item function
function getHumanListed(single){
   let container = single.lastChild;
   let text = container.innerText;
   let id = text.split("#")[1];
   let url = api_url + id;

   if (((id || "").includes("$")) || id == null ){
   } else {
        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let job = data['job'];

            // hardcoded shortener so UI doesn't break on too long names
            if (job.includes("Human Resources Specialist")){
                job = "HR Specialist";
            }

            container.append(job + ": " + data['unclaimed'] + "$hotm");
        })
        .catch((error) => {
          // console.log(error)
        })
     }
}

// process collection item function
function getHuman(article){

    let name = article.getElementsByClassName("AssetCardFooter--name")[0];
    let id = name.innerHTML.split("#")[1];
    let url = api_url + id;

    // skip existing items
    if (((article.innerText || "").includes("$")) || id == null ){
     } else {

        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // another check after promise resolved
            if (((article.innerText || "").includes("$")) || id == null ){
            }else{
                let job = data['job'];
                if (job.includes("Human Resources Specialist")){
                    job = "HR Specialist";
                }
                article.prepend(data['unclaimed'] + " $hotm");
                article.append(job);
            }
        })
        .catch((error) => {
          // console.log(error)
        })
     }
}
