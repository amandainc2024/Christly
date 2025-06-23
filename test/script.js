(function () {

  angular.module('App', []).
  controller('QuillController', QuillController);

  QuillController.$inject = ['$scope'];

  function QuillController($scope) {

    const vm = $scope;
    const toolbarOptions = [
    { 'font': [] },
    { 'header': [1, 2, 3, 4, 5, 6, false] },
    { 'align': [] },
    'bold', 'italic', 'underline',
    { 'color': [] },
    { 'background': [] },
    { 'list': 'bullet' },
    'link'];

    const options = {
      placeholder: 'Compose an epic...',
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions } };


    const quill = new Quill('#editor', options);
    let Inline = Quill.import('blots/inline');
    class MergeTagBlot extends Inline {}
    MergeTagBlot.blotName = 'mergetag';
    MergeTagBlot.tagName = 'merge-tag';

    Quill.register(MergeTagBlot);

    vm.cursorPosition = 0;
    vm.selectedText = undefined;
    vm.quillContents = undefined;
    vm.insertMergeTag = insertMergeTag;

    function insertMergeTag() {
      quill.clipboard.dangerouslyPasteHTML(vm.cursorPosition, '<p>text</p><ul><li>first bullet item</li></ul>');
    }

    // quill

    quill.on('editor-change', function (eventName, ...args) {
      if (eventName === 'text-change') {
        // args[0] will be delta
        console.log('editor-change', args);

        let quillContents = quill.root.innerHTML;
        console.log('QUILL', quillContents);

        $scope.$evalAsync(() => {
          vm.quillContents = quillContents;
        });

      } else if (eventName === 'selection-change') {
        // args[0] will be old range
        console.log('selection-change', args);
        if (args[0]) {
          $scope.$evalAsync(() => {
            vm.cursorPosition = args[0].index;
          });
        }
      }
    });

    quill.on('selection-change', function (range) {
      if (range) {
        if (range.length == 0) {
          console.log('User cursor is on', range.index);
          $scope.$apply(() => {
            vm.cursorPosition = range.index;
          });
          console.log('vm.cursorPosition', vm.cursorPosition);
        } else {
          var text = quill.getText(range.index, range.length);
          console.log('User has highlighted', text);
          $scope.$evalAsync(() => {
            vm.selectedText = text;
          });
        }
      } else {
        console.log('Not in focus');
        $scope.$evalAsync(() => {
          vm.cursorPosition = 'N/A';
          vm.selectedText = 'N/A';
        });
      }
    });

  }

})();