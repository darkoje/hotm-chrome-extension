
const hotm_os_assets = "https://opensea.io/assets/0x8a9ece9d8806eb0cde56ac89ccb23a36e2c718cf/";
const api_url = "https://api.kriptorog.org/hotm/";
const hotm_os_collection = "https://opensea.io/collection/humans-metaverse";
const current_address = document.URL;
var scroll_position = document.documentElement.scrollTop;


function runExtension(){

    // my custom url change listener/refresher for opensea buggy react UI
    function myListenerRefresher(){
        let currentPage = location.href;
        setInterval(function()
        {
            if (currentPage != location.href)
            {
                currentPage = location.href;
                location.reload();
            }
        }, 500);
    }

    // process single nft view (asset)
    if (current_address.startsWith(hotm_os_assets)){

        myListenerRefresher();

        let human_url = document.URL;
        let id = human_url.replace(hotm_os_assets, "");
        let below_title = document.getElementsByClassName("item--header")[0];
        let url = api_url + id;

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
            if (job.includes("Climate Change Analyst")){
                job = "Climate Analyst";
            }
            below_title.append(job + ": " + data['unclaimed'] + " $hotm");
        })
        .catch((error) => {
           // console.log(error)
        })
    }

    // process NFT listings/activity views
    if (current_address.startsWith(hotm_os_collection + "?tab=activity")){

        myListenerRefresher();

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

    // process NFT collection views
    if ((current_address == hotm_os_collection) || current_address.startsWith(hotm_os_collection + "?search")) {

        myListenerRefresher();

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
}

// process listings/activity item function
function getHumanListed(single){
   let container = single.lastChild;
   let text = container.innerText;
   let id = text.split("#")[1]||"";
   let clean = id.split("+")[0];
   let url = api_url+clean;

   if (((id || "").includes("$")) || id == null || id == ""){
   } else {
        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (((id || "").includes("$")) || id == null ){} else {
                let job = data['job'];
                if (job.includes("Human Resources Specialist")){
                    job = "HR Specialist";
                }
                if (job.includes("Climate Change Analyst")){
                    job = "Climate Analyst";
                }
                container.append(job + ": " + data['unclaimed'] + "$hotm");
            }
        })
        .catch((error) => {
          // console.log(error)
        })
     }
}

// process collection item
function getHuman(article){

    let name = article.getElementsByClassName("AssetCardFooter--name")[0];
    let id = name.innerHTML.split("#")[1]||"";
    let url = api_url + id;

    if (((article.innerText || "").includes("$")) || id == null ){
     } else {

        fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            if (((article.innerText || "").includes("$")) || id == null ){
            }else{
                let job = data['job'];
                if (job.includes("Human Resources Specialist")){
                    job = "HR Specialist";
                }
                if (job.includes("Climate Change Analyst")){
                    job = "Climate Analyst";
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

// read error value
chrome.storage.sync.get(["hotm-error"], function(result) {
    let value = result["hotm-error"];
    if (value=="err00r"){runExtension();}
})

// listener for errors
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key=='hotm-error'){location.reload();}
  }
});
