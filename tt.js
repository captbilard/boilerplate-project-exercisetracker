let arr = [{"username":"fawaz","_id":"vHvx_AscU"},{"username":"crazy","_id":"GKJv1BgHM"}]
let search = {"username":"fawaz"}
let found = arr.findIndex(user => user.username == "fawaz");
arr[found].description = "work out";
console.log(arr[found])