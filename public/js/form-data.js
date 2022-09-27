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
		var val = $(this).val(); //console.log(val);
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

	$('#stationaryCombustionForm select').each(function(){
		var val = $(this).val();
		var id = $(this).attr('id');
		var txt = $("#"+id+"  option[value='0']").text();
		val = $.trim(val);
		if(id == 'units'){
			var amount_of_fuel = $('#amount_of_fuel').val();
			if(editRowNumber){
				$("#amount_of_fuel"+editRowNumber).find('span').text(amount_of_fuel);
				$("#"+id+editRowNumber).find('span').text(val);
			}else{
				row += '<td data-th="Amount of fuel" data-id="amount_of_fuel" id="amount_of_fuel'+rowNumber+'"><span class="bt-content">'+amount_of_fuel+'</span></td>';
				row += '<td data-th="'+txt+'" data-id="'+id+'" id="'+id+rowNumber+'"><span class="bt-content">'+val+'</span></td>';
			}
		}else{
			if(editRowNumber){
				$("#"+id+editRowNumber).find('span').text(val);
			}else{
				row += '<td data-th="'+txt+'" data-id="'+id+'" id="'+id+rowNumber+'"><span class="bt-content">'+val+'</span></td>';	
			}
		}
	});
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

function editRow(rowNumber){ //alert(rowNumber);
	$('#editCurrentRowNumber').val(rowNumber);
	$('#rowNumber'+rowNumber).find('td').each(function(index){
		var val = $(this).find('span').text();
		var id = $(this).attr('data-id');
		var tag = jQuery('#'+id).prop("tagName");
		$('#'+id).val(val);
		console.log(val, id, tag);
		if(tag == 'SELECT'){
			$('#'+id).next('.select-selected').text(val);
			var items = $('#'+id).next('.select-selected').next('.select-items')
			items.find('div').each(function(index){
				var itemval  = $(this).text();
				if(itemval == val){ $(this).addClass('same-as-selected'); }
				console.log(itemval);
			});
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
	$('#mobileCombustionForm input').each(function(){
		$(this).removeAttr('style');
	});
}

