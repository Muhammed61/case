var saveDataConfirm = new bootstrap.Modal(document.getElementById("saveDataConfirm"), {});
var resetDataConfirm = new bootstrap.Modal(document.getElementById("resetDataConfirm"), {});
var deleteDataConfirm = new bootstrap.Modal(document.getElementById("deleteDataConfirm"), {});

$('#storeFormData').on('click', function(){
	var error = 0;
	$('#stationaryCombustionForm input').each(function(){
		var errorid = $(this).attr("id");
		var val = $(this).val();
		if(val){
			$(this).removeAttr('style');
		}else{
			if(errorid != 'amount_of_fuel'){
				$(this).css('border', '1px solid red');
				error = 1;
			}
		}
	});

	$('#stationaryCombustionForm select').each(function(){
		var errorid = $(this).attr("id");
		var val = $(this).val();
		if(val != 0 && val){
			$(this).parent(".selroundbox").removeAttr('style');
		}else{
			if(errorid != 'amount_of_fuel'){
				$(this).parent(".selroundbox").css( "border", "1px solid red" );
				error = 1;
			}
		}
	});

	var amount_of_fuel = $('#amount_of_fuel').val();
	var units = $('#units').val();
	if(amount_of_fuel && units != 0 && units){ $('.amountoffuelbox').removeAttr('style'); }else{ $('.amountoffuelbox').css('border', '1px solid red'); error = 1; }

	if(error == 0){
		saveDataConfirm.show();
	}

	return false;
});


$('#resetDataConfirmBtn').on('click', function(){
	const avilableval = [];
	$('#stationaryCombustionForm input').each(function(){
		var val = $(this).val();
		val = $.trim(val);
		if(val && val != 'Sıfırla' && val != 'Kaydet'){ avilableval.push(val); }
	});

	$('#stationaryCombustionForm select').each(function(){
		var val = $(this).val();
		val = $.trim(val);
		if(val && val != 0){ avilableval.push(val); }
	});

	if(avilableval.length > 0){
		resetDataConfirm.show();
	}
});

$('#deleteDataConfirmBtn').on('click', function(){
	deleteDataConfirm.show();
});

$('#resetDataConfirmYes').on('click', function(){
	resetFormData();
	resetDataConfirm.hide();
});

var tbody = $('#storeDataTable').children('tbody');
var table = tbody.length ? tbody : $('#storeDataTable');
$('#saveDataConfirmYes').on('click', function(){
	var rowNumber = $('#rowcount').val();
	var row = '<tr id="rowNumber'+rowNumber+'">';
	var editRowNumber = $('#editCurrentRowNumber').val();

	/*$('#stationaryCombustionForm select').each(function(){
		var val = $(this).val();
		var id = $(this).attr('id');
		var txt = $("#"+id+"  option[value='0']").text();
		val = $.trim(val);
		if(id != 'category' && id != 'made_of_transport' && id != 'units' && id != 'vehicle_type'){
			if(editRowNumber){
				$("#"+id+editRowNumber).find('span').text(val);
			}else{
				row += '<td data-th="'+txt+'" data-id="'+id+'" id="'+id+rowNumber+'"><span class="bt-content">'+val+'</span></td>';	
			}
		}
	});*/

	var category = $('#category').val();
	var made_of_transport = $('#made_of_transport').val();
	var vehicle_type = $('#vehicle_type').val();
	var units = $('#units').val();
	var facility_id = $('#facility_id').val();
	var year = $('#year').val();
	var emission_factor_dataset = $('#emission_factor_dataset').val();
	var activity_type = $('#activity_type').val();
	var amount_of_fuel = $('#amount_of_fuel').val();

	if(editRowNumber){
		$("#facility_id"+editRowNumber).find('span').text(facility_id);
		$("#year"+editRowNumber).find('.tbcomtext').text(year);
		$("#year"+editRowNumber).find('.tablsubtext').text(category);
		$("#emission_factor_dataset"+editRowNumber).find('.tbcomtext').text(emission_factor_dataset);
		$("#emission_factor_dataset"+editRowNumber).find('.tablsubtext').text(made_of_transport);
		$("#activity_type"+editRowNumber).find('.tbcomtext').text(activity_type);
		$("#activity_type"+editRowNumber).find('.tablsubtext').text(vehicle_type);
		$("#amount_of_fuel"+editRowNumber).find('.tbcomtext').text(amount_of_fuel);
		$("#amount_of_fuel"+editRowNumber).find('.tablsubtext').text(units);
	}else{
		row += '<td data-th="Facilty ID" data-id="facility_id" id="facility_id'+rowNumber+'" class="boxr fiid"><span class="bt-content">'+facility_id+'</span></td>';
		row += '<td data-th="Year" data-id="year" id="year'+rowNumber+'" class="tabtdplrnone"><span class="bt-content"><div class="tbcomtext">'+year+'</div><div class="tabtitble">Category</div><div class="tablsubtext">'+category+'</div></span></td>';
		row += '<td data-th="Emission factor dataset" data-id="emission_factor_dataset" id="emission_factor_dataset'+rowNumber+'" class="tabtdplrnone"><span class="bt-content"><div class="tbcomtext">'+emission_factor_dataset+'</div><div class="tabtitble">Made of transport</div><div class="tablsubtext">'+made_of_transport+'</div></span></td>';
		row += '<td data-th="Activity Type" data-id="activity_type" id="activity_type'+rowNumber+'" class="tabtdplrnone"><span class="bt-content"><div class="tbcomtext">'+activity_type+'</div><div class="tabtitble">Vehicle type</div><div class="tablsubtext">'+vehicle_type+'</div></span></td>';
		row += '<td data-th="Amount of Activity" data-id="amount_of_fuel" id="amount_of_fuel'+rowNumber+'" class="tabtdplrnone"><span class="bt-content"><div class="tbcomtext">'+amount_of_fuel+'</div><div class="tabtitble">Units</div><div class="tablsubtext">'+units+'</div></span></td>';

		/*var emission_factor_dataset_html = $('#emission_factor_dataset'+rowNumber).html();
		var activity_type_html = $('#activity_type'+rowNumber).html();
		var amount_of_fuel_html = $('#amount_of_fuel'+rowNumber).html();
		var year_html = $('#year'+rowNumber).html();

		$('#emission_factor_dataset'+rowNumber).html('');
		$('#activity_type'+rowNumber).html();
		$('#amount_of_fuel'+rowNumber).html();
		$('#year'+rowNumber).html();*/
	}

	$('#stationaryCombustionForm input').each(function(){
		var val = $(this).val();
		val = $.trim(val);
		var id = $(this).attr('id');
		var txt = $(this).prev('span').text();
		if(val != 'Sıfırla' && val != 'Kaydet' && id != 'amount_of_fuel'){ 
			if(editRowNumber){
				$("#"+id+editRowNumber).find('span').text(val);
			}else{
				row += '<td data-th="'+txt+'" data-id="'+id+'" id="'+id+rowNumber+'"><span class="bt-content">'+val+'</span></td>';
			}
		}
	});
	row += '<td class="tableright" data-th="&nbsp;"><span class="bt-content"><a class="tabbtn" onclick="deleteRow('+rowNumber+');" data-row="'+rowNumber+'" href="javascript:void(0);">Sil</a><br><a class="tabbtn" onclick="editRow('+rowNumber+');" data-row="'+rowNumber+'" href="javascript:void(0);">Düzenle</a><br></span></td></tr>';

	if(editRowNumber == ''){ table.append(row); }

	resetFormData();
	$('.formtablesec').show();
	saveDataConfirm.hide();
	if(editRowNumber == ''){ $('#rowcount').val(parseInt(rowNumber)+1); }
	$('#editCurrentRowNumber').val('');
});	

$('#deleteDataConfirmYes').on('click', function(){
	var rowNumber = $('#deleterowcount').val();
	 $('#rowNumber'+rowNumber).remove();
	 deleteDataConfirm.hide();
	 $('#deleterowcount').val('');

	 var rowCount = $('#storeDataTable >tbody >tr').length;
	 if(rowCount == 0){ $('.formtablesec').hide(); }
	 resetFormData();
});	

function deleteRow(rowNumber){
	$('#deleterowcount').val(rowNumber);
	deleteDataConfirm.show();
}

function editRow(rowNumber){
	$('#editCurrentRowNumber').val(rowNumber);
	$('#rowNumber'+rowNumber).find('td').each(function(index){
		var val = $(this).find('span').text();
		var id = $(this).attr('data-id');
		var tag = jQuery('#'+id).prop("tagName");
		if(id != 'amount_of_fuel'){ $('#'+id).val(val); }
		if(tag == 'SELECT'){
			var facility_id = $('#facility_id'+rowNumber).find('span').text();
			var emission_factor_dataset_html = $('#emission_factor_dataset'+rowNumber).find('.tbcomtext').text();
			var activity_type_html = $('#activity_type'+rowNumber).find('.tbcomtext').text();
			var amount_of_fuel_html = $('#amount_of_fuel'+rowNumber).find('.tbcomtext').text();
			var year_html = $('#year'+rowNumber).find('.tbcomtext').text();
			var category = $('#year'+rowNumber).find('.tablsubtext').text();
			var made_of_transport = $('#emission_factor_dataset'+rowNumber).find('.tablsubtext').text();
			var vehicle_type = $('#activity_type'+rowNumber).find('.tablsubtext').text();
			var units = $('#amount_of_fuel'+rowNumber).find('.tablsubtext').text();

			//alert(amount_of_fuel_html);

			$('#facility_id').next('.select-selected').text(facility_id);
			$('#emission_factor_dataset').next('.select-selected').text(emission_factor_dataset_html);
			$('#activity_type').next('.select-selected').text(activity_type_html);
			$('#year').next('.select-selected').text(year_html);
			$('#category').next('.select-selected').text(category);
			$('#made_of_transport').next('.select-selected').text(made_of_transport);
			$('#vehicle_type').next('.select-selected').text(vehicle_type);
			$('#units').next('.select-selected').text(units);
			$('#amount_of_fuel').val(amount_of_fuel_html);

			$('#facility_id').val(facility_id);
			$('#emission_factor_dataset').val(emission_factor_dataset_html);
			$('#activity_type').val(activity_type_html);
			$('#year').val(year_html);
			$('#category').val(category);
			$('#made_of_transport').val(made_of_transport);
			$('#vehicle_type').val(vehicle_type);
			$('#units').val(units);

			var items = $('#emission_factor_dataset').next('.select-selected').next('.select-items')
			items.find('div').each(function(index){
				var itemval  = $(this).text();
				if(itemval == emission_factor_dataset){ $(this).addClass('same-as-selected'); }
			});

			/*$('#'+id).next('.select-selected').text(val);
			var items = $('#'+id).next('.select-selected').next('.select-items')
			items.find('div').each(function(index){
				var itemval  = $(this).text();
				if(itemval == val){ $(this).addClass('same-as-selected'); }
				console.log(itemval);
			});*/
		}
	});
	$("html, body").animate({ scrollTop: 0 }, "slow");
}

function resetFormData(){
	$('#stationaryCombustionForm').trigger("reset");
	$('.select-items').find('div').removeClass('same-as-selected');

	$('.select-selected').each(function(){
		$(this).prev("select").val(0);
		var id = $(this).prev("select").attr('id');
		var txt = $("#"+id+"  option[value='0']").text();
		$(this).text(txt);
	});
	$('#editCurrentRowNumber').val('');
	$(".selroundbox").removeAttr('style');
	$('#stationaryCombustionForm input').each(function(){
		$(this).removeAttr('style');
	});
}