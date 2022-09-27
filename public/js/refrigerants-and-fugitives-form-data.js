var saveDataConfirm = new bootstrap.Modal(document.getElementById("saveDataConfirm"), {});
var resetDataConfirm = new bootstrap.Modal(document.getElementById("resetDataConfirm"), {});
var deleteDataConfirm = new bootstrap.Modal(document.getElementById("deleteDataConfirm"), {});

$('#storeFormData').on('click', function(){
	var error = 0;

	$('#refrigerantsFugitivesForm select').each(function(){
		var errorid = $(this).attr("id");
		var val = $(this).val(); //console.log(val);
		if(val != 0 && val){
			$(this).parent(".selroundbox").removeAttr('style');
		}else{
			$(this).parent(".selroundbox").css( "border", "1px solid red" );
			error = 1;
		}
	});

	$('.alaniform select').each(function(){ 
		var errorid = $(this).attr("id"); 
		var val = $(this).val();

		var parentdiv = $(this).parents(".selroundbox");
		var inputval = parentdiv.find('input').val();
		if(val != 0 && val && inputval){
			$(this).parents(".selroundbox").removeAttr('style');
		}else{
			$(this).parents(".selroundbox").css( "border", "1px solid red" );
			error = 1;
		}
	});
	if(error == 1){ $("html, body").animate({ scrollTop: 0 }, "slow"); }

	var co2e = $('#co2e').val();
	if(co2e && co2e != ''){ $('#co2e').removeAttr('style'); }else{ $('#co2e').css('border', '1px solid red'); error = 1; }

	if(error == 0){
		saveDataConfirm.show();
	}

	return false;
});


$('#resetDataConfirmBtn').on('click', function(){
	const avilableval = [];
	$('#refrigerantsFugitivesForm select').each(function(){
		var val = $(this).val();
		val = $.trim(val);
		if(val && val != 0){ avilableval.push(val); }
	});

	$('#refrigerantsFugitivesForm input').each(function(){
		var newval = $(this).val();
		newval = $.trim(newval);
		if(newval && newval != 0 && $('#rfrg_charged').val() != 2){ avilableval.push(newval); }
	});

	var co2e = $('#co2e').val();
	if(co2e && co2e != ''){ avilableval.push(co2e); }
	/*setTimeout(function () {
	     if(avilableval.length > 0){
			resetDataConfirm.show();
		}
	}, 1000);*/
	resetDataConfirm.show();
	
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

	$('.refthreeboxsec select').each(function(){
		var val = $(this).val();
		var id = $(this).attr('id');
		var txt = $("#"+id+"  option[value='0']").text();
		val = $.trim(val);
		if(editRowNumber){
			$("#"+id+editRowNumber).find('span').text(val);
		}else{
			row += '<td data-th="'+txt+'" data-id="'+id+'" id="'+id+rowNumber+'"><span class="bt-content">'+val+'</span></td>';
		}
	});

	var co2e = $('#co2e').val();
	if(co2e && co2e != ''){
		if(editRowNumber){
			$("#co2e"+editRowNumber).find('span').text(co2e);
		}else{
			row += '<td data-th="co2e" data-id="co2e" id="co2e'+rowNumber+'"><span class="bt-content">'+co2e+'</span></td>';
		}
	}

	row += '<td class="tableright" data-th="&nbsp;"><span class="bt-content"><a class="tabbtn" onclick="deleteRow('+rowNumber+');" data-row="'+rowNumber+'" href="javascript:void(0);">Sil</a><br><a class="tabbtn" onclick="editRow('+rowNumber+');" data-row="'+rowNumber+'" href="javascript:void(0);">Düzenle</a><br></span></td></tr>';

	if(editRowNumber == ''){ table.append(row); }

	var otherdata = '';
	$('.alaniform select').each(function(){ 
		var errorid = $(this).attr("id"); 
		var val = $(this).val();
		var parentdiv = $(this).parents(".selroundbox");
		var inputval = parentdiv.find('input').val();
		var inputid = parentdiv.find('input').attr('id');

		if(editRowNumber){
			$('body').find('#selectitem_'+errorid+editRowNumber).val(val);
			$('body').find('#inputitem_'+inputid+editRowNumber).val(inputval);
			//console.log('#selectitem_'+errorid+editRowNumber, '#inputitem_'+inputid+editRowNumber);
		}else{
			$('.addedboxdata').append('<input type="hidden" id="selectitem_'+errorid+rowNumber+'" value="'+val+'" />');
			$('.addedboxdata').append('<input type="hidden" id="inputitem_'+inputid+rowNumber+'" value="'+inputval+'" />');
		}
	});
	var rfrg_charged = $('#rfrg_charged').val();

	
	if(editRowNumber){
		$('body').find('#radiobtn_'+editRowNumber).val(rfrg_charged);
	}else{
		$('.addedboxdata').append('<input type="hidden" id="radiobtn_'+rowNumber+'" value="'+rfrg_charged+'" />');
	}

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
		if(tag == 'SELECT'){
			$('#'+id).next('.select-selected').text(val);
			var items = $('#'+id).next('.select-selected').next('.select-items')
			items.find('div').each(function(index){
				var itemval  = $(this).text();
				if(itemval == val){ $(this).addClass('same-as-selected'); }
			});
		}
	});

	$('.alaniform select').each(function(){ 
		var errorid = $(this).attr("id"); 
		var val = $('#selectitem_'+errorid+rowNumber).val();
		$(this).val(val);
		$(this).next('.select-selected').text(val);
		var items = $(this).next('.select-selected').next('.select-items')
		items.find('div').each(function(index){
			var itemval  = $(this).text();
			if(itemval == val){ $(this).addClass('same-as-selected'); }
		});

		var parentdiv = $(this).parents(".selroundbox");
		var inputid = parentdiv.find('input').attr('id');
		var inputval = $('#inputitem_'+inputid+rowNumber).val();
		parentdiv.find('input').val(inputval);


	});

	var rfrg_charged = $('#radiobtn_'+rowNumber).val();
	$('#rfrg_charged').val(rfrg_charged);
	change_charged(rfrg_charged);

	$("html, body").animate({ scrollTop: 0 }, "slow");
}

function resetFormData(){
	$('#refrigerantsFugitivesForm').trigger("reset");
	$('.select-items').find('div').removeClass('same-as-selected');

	$('.select-selected').each(function(){
		$(this).prev("select").val(0);
		var id = $(this).prev("select").attr('id');
		var txt = $("#"+id+"  option[value='0']").text();
		$(this).text(txt);
	});
	$('#editCurrentRowNumber').val('');
	$(".selroundbox").removeAttr('style');
	$('.refripagesec').find('input').removeAttr('style');
	$('#co2e').val('');
	change_charged(2);
}

function change_charged(val){
	if(val == 1){
		$('.chargedyes').removeClass('borbtn');
		$('.chargedno').addClass('borbtn');
	}else{
		$('.chargedno').removeClass('borbtn');
		$('.chargedyes').addClass('borbtn');
	}
	$('#rfrg_charged').val(val);
}