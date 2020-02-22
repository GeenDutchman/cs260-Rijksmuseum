document.getElementById("searchSubmit").addEventListener("click", event => {
    event.preventDefault();
    const value = document.getElementById("searchText").value;
    if (value === "") {
        return;
    }
    const url = "https://www.rijksmuseum.nl/api/nl/usersets?key=R0LtHLE4&format=json&page=1&pageSize=10";
    fetch(url)
        .then( response => {return response.json();})
        .then( json => {
            console.log(json);
            return process_usersets(json);
        }).then(ids => {
            return process_ids(ids);
        }).catch( error => {console.error(error);});
});

function process_usersets(json) {
    userIds = [];
    result = "";
    for (let set of json.userSets) {
        userIds.push(set.id);
        result += "<div id='" + set.id + "-div' class='card user-set'>";
        result += "<img class='card-img-top' src='/images/Camera.svg' alt='Not yet loaded' id='" + set.id + "-img' />";
        result += "<p><a href='" + set.links.web + "'>" + set.name + "</a></p>";
        result += "<p>Door " + set.user.name + " verzameld</p>";
        result += "<div id='" + set.id + "-desc' >";
        if (set.description !== null) {
            result += "<p>" + set.description + " </p>";
        }
        result += "</div>";
        result += "</div>";
    }
    document.getElementById("art-content").innerHTML += result;

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
    debugger;
    if (json.userSet.setItems.length > 0) {
        const first = json.userSet.setItems[0];
        document.getElementById(id + "-img").src = first.image.cdnUrl;
        if (first.relationDescription !== null) {
            document.getElementById(id + "-desc").innerHTML += "<p>" + first.relationDescription + "</p>";
        }
    } else {
        document.getElementById(id + "-img").alt = "No image to show";
    }

}