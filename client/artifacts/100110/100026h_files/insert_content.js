// simply insert the active content
// (avoids user needing to click on viewer to interact)
function insert_100026h_content()
{
var str = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="800" height="600" id="3dsom_viewer" align="middle" >';
str += '<param name="allowScriptAccess" value="sameDomain" >';
str += '<param name="allowFullScreen" value="true" >';
str += '<param name="wmode" value="gpu" >';
str += '<param name="base" value="100026h_files">';
str += '<param name="movie" value="100026h_files/3dsom_viewer.swf" >';
str += '<param name="quality" value="medium" >';
str += '<param name="bgcolor" value="#ffffff" >';
str += '<embed src="100026h_files/3dsom_viewer.swf" quality="medium" bgcolor="#ffffff" width="800" height="600" name="3dsom_viewer" base="100026h_files" align="middle" allowScriptAccess="sameDomain" allowFullScreen="true" wmode="gpu" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" >';
str += '</object>';

document.write(str);
}


