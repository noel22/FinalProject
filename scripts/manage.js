$(document).ready(function(){

	let masonry = new Masonry('.grid');
	masonry.layout();

	// Ajax setup
	$.ajaxSetup({
	    beforeSend: function(xhr) {
	        xhr.setRequestHeader("X-CSRFToken", '{{ csrf_token }}');
	    }
	});
	// Get data for Labor and statistics
	$.post('/managementController',
		{
			action: 'getWageAndLaborStatistics'
		},
		function(data,status) {
			let stats = JSON.parse(data);

			let items = "<div class='row card-item'><div class='col-7'><p>Total Sales</p></div>"
			+ "<div class='col-5 text-right'>" + stats.sales + "</div></div>"
			+ "<div class='row card-item'><div class='col-7'><p>Total Discounts</p></div>"
			+ "<div class='col-5 text-right'>" + stats.discounts + "</div></div>"
			+ "<div class='row card-item'><div class='col-7'><p>Total Labor Hours</p></div>"
			+ "<div class='col-5 text-right'>" + stats.labor_hours + "</div></div>"
			+ "<div class='row card-item'><div class='col-7'><p>Total Sales</p></div>"
			+ "<div class='col-5 text-right'>" + stats.labor_wages + "</div></div>"
			+ "<div class='row card-item'><div class='col-7'><p>Labor Percentage</p></div>"
			+ "<div class='col-5 text-right'>" + ( stats.labor_percent_of_profit * 100) + "%</div></div>"
			+ "<div class='row card-item'><div class='col-7'><p>Total Profit</p></div>"
			+ "<div class='col-5 text-right'>" + stats.profit + "</div></div>";

			$(items).appendTo('.profit-labor-stats');

			masonry.reloadItems();
			masonry.layout();
		}
	);
	// Get logged in users
	$.post('/managementController',
		{
			action: 'getLoggedInUsers'
		},
		function(data,status){
			let users = JSON.parse(data);

			let items = "";
			jQuery.each( users, function(index, user) {
				items += "<div class='row card-item'><div class='col-5'><p>" + user.name + "</p></div>"
				+ "<div class='col-7 text-right'><a href='javascript:void(0);' class='btn btn-danger clock-out-btn' data-id=" + user.id + ">Clock-Out</a></div></div>";
			});

			$(items).appendTo('.logged-in-workers');

			masonry.reloadItems();
			masonry.layout();
		}
	);
	// Get vendors
	$.post('/managementController',
		{
			action: 'getVendorsList'
		},
		function(data,status){
			let vendors = JSON.parse(data);
			
			let items = "";
			jQuery.each(vendors, function(index, data) {
				items += "<div class='row card-item'><div class='col-12'><p>" + data.name + "</p></div></div>";
			});

			$(items).appendTo('.vendors-list');

			masonry.reloadItems();
			masonry.layout();
		}
	);
	// Get supply orders
	$.post('/managementController',
		{
			action: 'getSupplyOrders'
		},
		function(data,status){
			let orders = JSON.parse(data);
			let items = "";
			jQuery.each(orders, function(index, item) {
				items += "<div class='order-item-container pl-0'>" + addModal(item)
					+ "<div class='mb-5 row'><div class='col-8'>" + item.name + "</div><div class='col-4 text-right'><a href='javascript:void(0);' class='btn btn-success view-btn'>View</a></div></div></div>";
			});

			$(items).appendTo('.supply-orders');

			masonry.reloadItems();
			masonry.layout();
		}
	);

	function addModal(item) {
		let list_items = "";
		jQuery.each(item.list, function(index, item) {
			list_items += "<div class='col-7'>" + item.name + "</div><div class='col-2'>$" + item.price + "</div><div class='col-1 text-center'>X</div><div class='col-2 text-right bbtm-black-1'>" + item.quantity + "</div>";
		});

		let modal = "<div class='modal fade show' style='display:none;'><div class='modal-dialog'>"
				+ "<div class='modal-content'><div class='modal-header border-bottom-0 bb-gray-1'>"
				+ "<div class='col-12 pl-0'><h4>" + item.name + "</h4></div><div class='col-4 text-right'>"
				+ "</div></div><div class='modal-body'><div class='row pb-16'>"
				+ list_items
				+ "</div><div class='row pt-16'><div class='col-5'><strong>Total</strong></div><div class='col-7 text-right'>" + item.total + "</div>"
				+ "</div></div><div class='modal-footer border-top-0'>"
				+ "<a href='javascript:void(0);' class='btn btn-danger modal-close'>Close</a></div></div></div></div>";
		return modal;
	}

	$('.supply-orders').on('click', '.view-btn', function() {
		$(this).closest('.order-item-container').find('.modal').show();
	});
	$('.supply-orders').on('click', '.modal-close', function() {
		$('.modal').hide();
	});

	// Add return to menu button
	addReturnButton();
	function addReturnButton() {
		let button = "<a href='javascript:void(0);' class='btn btn-primary go-back-btn'>Go Back</a>";
		$(button).appendTo('.nav-card .row .right-side');
	}
	$('.nav-card').on('click', '.go-back-btn', function() {
		$('.navigation').submit();
	});

	// Clock out user
	$('.logged-in-workers').on('click', '.clock-out-btn', function() {
		let id = $(this).attr('data-id');

		$.post('/managementController',
			{
				action: 'logoutUser',
				id: id
			},
			function(data, status) {
				alert(data + ' was clocked out.' );
			}
		);

		$(this).closest('.card-item').remove();
	});

});


