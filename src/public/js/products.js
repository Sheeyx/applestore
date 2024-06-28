console.log("Products frontend JavaScript file");

$(function () {
    // Handle product collection change
    $(".product-collection").on("change", function() {
        const selectedValue = $(this).val();
        if (selectedValue === "DRINK") {
            $("#product-volume").show();
            $("#product-collection").hide();
        } else {
            $("#product-volume").hide();
            $("#product-collection").show();
        }
    });

    // Handle New Product button click
    $("#process-btn").on("click", function() {
        $(".dish-container").slideToggle(500);
        $(this).hide();
    });

    // Handle Cancel button click
    $("#cancel-btn").on("click", function(e) {
        e.preventDefault();
        $(".dish-container").slideToggle(100);
        $("#process-btn").css("display", "flex");
    });

    // Handle product status change
    $(".new-product-status").on("change", async function(e) {
        const id = e.target.id;
        const productStatus = $(this).val();

        try {
            const response = await axios.post(`/admin/product/${id}`, {
                productStatus: productStatus,
            });
            const result = response.data;

            if (result.data) {
                $(this).blur();
            } else {
                alert("Product update failed!");
            }
        } catch (err) {
            console.log("Error updating product status:", err);
            alert("Product update failed!");
        }
    });
});

function validateForm() {
    const productName = $(".product-name").val();
    const productPrice = $(".product-price").val();
    const productLeftCount = $(".product-left-count").val();
    const productCollection = $(".product-collection").val();
    const productDesc = $(".product-desc").val();
    const productStatus = $(".product-status").val();

    if (productName === "" || productPrice === "" || productLeftCount === "" || productCollection === "" || productDesc === "" || productStatus === "") {
        alert("Please fill in all details!");
        return false;
    } else {
        return true;
    }
}

function previewFileHandler(input, order) {
    const file = input.files[0];
    const fileType = file.type;
    const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    if (!validImageTypes.includes(fileType)) {
        alert("Please insert only jpeg, jpg, or png!");
        return;
    }
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            $(`#image-section-${order}`).attr("src", reader.result);
        };
        reader.readAsDataURL(file);
    }
}
