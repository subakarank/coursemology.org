$(document).ready(function() {
  function LessonPlanEntryFormType(pickers) {
    var self = this;
    this.pickers = pickers;
    pickers.forEach(function(picker) {
      picker.onSelectionCompleted = function() { self.doneCallback.apply(self, arguments); }
    });
  }

  LessonPlanEntryFormType.prototype.pick = function() {
    if (this.$modal) {
        this.$modal.remove();
    }

    this.$modal = $('<div class="modal hide fade" />');
    this.pickers[0].pick(this.$modal[0]);
    this.$modal.modal();
  }

  LessonPlanEntryFormType.prototype.doneCallback = function(idTypePairList) {
    idTypePairList.forEach(function(x) {
      $element = $('<tr>\n\
        <td>' + x[2] + '</td>\n\
        <td>&nbsp;</td>\n\
        <td>\n\
          <span class="btn btn-danger resource-delete"><i class="icon-trash"></i></span>\n\
          <input type="hidden" name="resources[]" value="' + x[0] + ',' + x[1] + '" />\n\
        </td>\n\
      </tr>');
      $("#linked_resources tbody").append($element);
    });
  };

  var LessonPlanEntryForm = new LessonPlanEntryFormType([new MaterialsFilePicker()]);

  $('.addresource-button').click(function() {
    LessonPlanEntryForm.pick();
  });
  $(document).on('click', '.resource-delete', null, function() {
    $(this).parents('tr').remove();
  });
  
  $('#lesson-plan-hide-all').click(function() {
    $('.lesson-plan-body').slideUp();
    $('.lesson-plan-show-entries').show();
    $('.lesson-plan-hide-entries').hide();
  });
  
  $('#lesson-plan-show-all').click(function() {
    $('.lesson-plan-body').slideDown();
    $('.lesson-plan-show-entries').hide();
    $('.lesson-plan-hide-entries').show();
  });
  
  $('.lesson-plan-hide-entries').click(function() {
    $(this).hide();
    var parent = $(this).parents('.lesson-plan-item');
    $('.lesson-plan-body', parent).slideUp();
    $('.lesson-plan-show-entries', parent).show();
  });
  
  $('.lesson-plan-show-entries').click(function() {
    $(this).hide();
    var parent = $(this).parents('.lesson-plan-item');
    $('.lesson-plan-body', parent).slideDown();
    $('.lesson-plan-hide-entries', parent).show();
  });

  $('#lesson-plan-done-generating').click(function() {
    /*const*/ var DATE_FORMAT = 'DD-MM-YYYY';

    var milestone_count = $('input#input-number-milestones').val();
    var milestone_length_in_days = $('input#input-length-milestones').val();
    var milestone_prefix = $('input#input-prefix-milestones').val();
    var first_milestone = $('input#input-start-milestones').val();

    var current_milestone = moment(first_milestone, DATE_FORMAT);
    var milestones = [];
    for (var i = 0; i < milestone_count; ++i) {
      current_milestone.add('days', parseInt(milestone_length_in_days));
      milestones.push({title: milestone_prefix + ' ' + (i + 1), end_at: current_milestone.clone() });
    }

    var promises = [];
    for (var i = 0; i < milestones.length; ++i) {
      var milestone = milestones[i];
      promises.push($.ajax({
        type: 'POST',
        url: 'lesson_plan/milestones.json',
        data: {
          lesson_plan_milestone: {
            title: milestone.title,
            description: '',
            end_at: milestone.end_at.format(DATE_FORMAT)
          }
        },
        dataType: 'json'
      }));
    }

    // Show the progress bar.
    var $modal = $(this).parents('.modal');
    $('.modal-body', $modal).addClass('hidden');
    $('#modal-loading', $modal).parent().removeClass('hidden');
    $('button.btn', $modal).addClass('disabled').prop('disabled', true);

    // Wait for all the requests to come back before closing the dialog.
    $.when.apply($, promises).then(function() {
      $modal.modal('hide');
      location.href = location.href;
    }, function() {
      alert('An error occurred while processing your request.');
      $modal.modal('hide');
      location.href = location.href;
    });
    return false;
  });
});
