function getConfiguration(){
    //
    // var accessory = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,25))
    // accessory.addItemsWithObjectValues(items)
    // accessory.selectItemAtIndex(selectedItemIndex)

    var alert = COSAlertWindow.alloc().init()
    alert.setMessageText("Draw Table")

    alert.setInformativeText('Configure your table');


    alert.addTextLabelWithValue('Number of rows for talbe');
    alert.addTextFieldWithValue('5');


    alert.addTextLabelWithValue('Number of columns for talbe');
    alert.addTextFieldWithValue('5');


    alert.addTextLabelWithValue('cell width');
    alert.addTextFieldWithValue('30');


    alert.addTextLabelWithValue('cell height');
    alert.addTextFieldWithValue('30');

    alert.addButtonWithTitle('OK')
    alert.addButtonWithTitle('Cancel')
    // alert.setAccessoryView(accessory)

    var responseCode = alert.runModal()
    var rowNum = [[alert viewAtIndex:1] floatValue]
    var colNum = [[alert viewAtIndex:3] floatValue]
    var cellWidth = [[alert viewAtIndex:5] floatValue]
    var cellHeight = [[alert viewAtIndex:7] floatValue]

    return [responseCode, rowNum,colNum, cellWidth, cellHeight]
}

function onRun(context) {

  var cellWidth = 10, cellHeight = 10, columNum = 5, rowNum = 5, startX = 10, startY = 10;
  var configure = getConfiguration()
  log(configure);
  if (!configure[0]) {
    return; // user cancelled
  }
  rowNum = configure[1]
  columNum = configure[2]
  cellWidth = configure[3]
  cellHeight = configure[4]

  var doc = context.document;

  var group = MSLayerGroup.alloc().init();
  group.setName("Table");

  // draw rectangle
  var path = NSBezierPath.bezierPath();
  path.moveToPoint(NSMakePoint(startX, startY));
  path.lineToPoint(NSMakePoint(startX + cellWidth * columNum, startY));
  path.lineToPoint(NSMakePoint(startX + cellWidth * columNum, startY + cellHeight * rowNum));
  path.lineToPoint(NSMakePoint(startX,startY + cellHeight * rowNum));
  path.closePath();

  var shape = MSShapeGroup.shapeWithBezierPath(path);
  var style = MSStyle.alloc().init();
  var fill = style.addStylePartOfType(0);
  // var fill = shape.style().fills().addNewStylePart(); this line does not work, you can check log in console
  fill.color = MSColor.colorWithSVGString("#dd4433");
  shape.setStyle(style);
  shape.setName("Table Border");

  group.addLayers([shape]);

  // Draw seperator lines
  // Draw vertical seperator lines
  for(var i = 1; i < columNum; i++){
    var path = NSBezierPath.bezierPath();
    path.moveToPoint(NSMakePoint(startX + i * cellWidth, startY));
    path.lineToPoint(NSMakePoint(startX + i * cellWidth, startY + rowNum * cellHeight));

    var shape = MSShapeGroup.shapeWithBezierPath(path);
    var style = MSStyle.alloc().init();
    var fill = style.addStylePartOfType(0);
    var border = style.addStylePartOfType(1);
   //  var border = shape.style().borders().addNewStylePart();
    border.color = MSColor.colorWithSVGString("#99aabb");
    border.thickness = 2;
    shape.setStyle(style);
    shape.setName("Column line " + i);

    group.addLayers([shape]);
  }

  // Draw horizontal seperator lines
  for(var i = 1; i < rowNum; i++){
    var path = NSBezierPath.bezierPath();
    path.moveToPoint(NSMakePoint(startX ,                       startY + i * cellHeight));
    path.lineToPoint(NSMakePoint(startX + columNum * cellWidth, startY + i * cellHeight));

    var shape = MSShapeGroup.shapeWithBezierPath(path);
    var style = MSStyle.alloc().init();
    var fill = style.addStylePartOfType(0);
    var border = style.addStylePartOfType(1);
    border.color = MSColor.colorWithSVGString("#99aabb");
    border.thickness = 2;
    shape.setStyle(style);
    shape.setName("Row line " + i);

    group.addLayers([shape]);
  }

  var selection = context.selection;
  var layer=selection.firstObject();
  if(layer) {
    layer.addLayers([group]);
  } else {
     doc.currentPage().addLayers([group]);
  }

};
