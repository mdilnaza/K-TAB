$("#add_prod").submit(function (event){
    alert("Product inserted successfully");
})

$("#update_prod").submit(function(event){
    event.preventDefault();

    const unindexed_array = $(this).serializeArray();
    const data = {};

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    var request = {
        "url" : `http://localhost:3001/update_prod/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("Product Updated Successfully!");
    })

})

if(window.location.pathname == "/admin"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3001/delete_prod/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("Product Deleted Successfully!");
                location.reload();
            })
        }
    })
}

$("#add_user").submit(function (event){
    alert("User inserted successfully");
})

$("#update_user").submit(function(event){
    event.preventDefault();

    const unindexed_array = $(this).serializeArray();
    const data = {};

    $.map(unindexed_array, function(n, i){
        data[n['name']] = n['value']
    })

    var request = {
        "url" : `http://localhost:3001/update_user/${data.id}`,
        "method" : "PUT",
        "data" : data
    }

    $.ajax(request).done(function(response){
        alert("User Updated Successfully!");
    })

})

if(window.location.pathname == "/users"){
    $ondelete = $(".table tbody td a.delete");
    $ondelete.click(function(){
        var id = $(this).attr("data-id")

        var request = {
            "url" : `http://localhost:3001/delete_user/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this record?")){
            $.ajax(request).done(function(response){
                alert("User Deleted Successfully!");
                location.reload();
            })
        }
    })
}