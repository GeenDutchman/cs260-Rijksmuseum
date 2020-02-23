window.addEventListener("load", event => {
// document.getElementById("searchSubmit").addEventListener("click", event => {
    // event.preventDefault();
    // const value = document.getElementById("searchText").value;
    // if (value === "") {
    //     return;
    // }
    load_usersets();
});

document.getElementById("paginator").addEventListener("click", event => {
    load_usersets();
});

function load_usersets() {
    page_button = document.getElementById("paginator");
    const page_num = page_button.value;
    const url = "https://www.rijksmuseum.nl/api/nl/usersets?key=R0LtHLE4&format=json&page=" + page_num;
    fetch(url)
        .then( response => {return response.json();})
        .then( json => {
            console.log(json);
            return process_usersets(json);
        }).then(ids => {
            let result = process_ids(ids);
            page_button.value = String(Number(page_num) + 1);
            return result;
        }).catch( error => {console.error(error);});
}


function process_usersets(json) {
    userIds = [];
    result = "";
    for (let set of json.userSets) {
        userIds.push(set.id);
    }
    // document.getElementById("art-content").innerHTML += result;

    return userIds;
}

function process_ids(ids) {
    for (let id of ids) {
        let url = "https://www.rijksmuseum.nl/api/nl/usersets/" + id + "?key=R0LtHLE4&format=json";
        fetch(url)
            .then(response => {
                return response.json();
            }).then(json => {
                console.log(json);
                process_for_id(id, json);
            }).catch(error => {
                console.error(error);
            });
    }
}

function process_for_id(id, json) {
    result = '';
    if (json.userSet.setItems.length > 0) {
        const set = json.userSet;
        const first = set.setItems[0];

        result += "<div id='" + set.id + "-div' class='card text-center user-set'>";
        // result += "<a href='" + first.links.web + "'>"; // why does this link not work?
        result += "<img class='card-img-top' src='" + first.image.cdnUrl + "' alt='" + first.relation + "' id='" + set.id + "-img' />";
        // result += "</a>";
        result += "<p><a href='" + set.links.web + "'>" + set.name + "</a></p>";
        result += "<p>Door \"" + set.user.name + "\" verzameld</p>";
        result += "<div id='" + set.id + "-desc' >";
        if (set.description !== null) {
            result += "<p>Beschrijving: " + set.description + " </p>";
        }
        if (first.relationDescription !== null) {
            result += "<p>Beschrijving van relatie: " + first.relationDescription + "</p>";
        }
        result += "</div>";
        result += "</div>";
    } else {
        console.debug("No image for this one");
    }

    document.getElementById("art-content").innerHTML += result;

}