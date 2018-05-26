//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011                                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER Init Layer Content                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Fill User generated Layers with Content                                  -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Function "userInitLayerContent"
//------------------------------------------------------------------------------

function userInitLayerContent() {

	//----------------------------------------------------------------------------
	//- Create User "div" Layers
	//----------------------------------------------------------------------------

  	//----------------------------------------------------------------------------
	//- Create SPX Logo "div" Layer
	//----------------------------------------------------------------------------

	var divElement = document.createElement('div');
	divElement.setAttribute('id', 'sys_RVB_Logo');

	divElement.style.top		= 0;
	divElement.style.left		= 5;
	divElement.style.width		= 250;
	divElement.style.height		= 200;

	divElement.style.visibility	= 'visible';
	divElement.style.position	= 'absolute';

	divElement.disabled		= false;

	divElement.innerHTML = '<img src="/images/reichsrat-von-buhl.small.png"></img>';

	document.body.appendChild(divElement);

}
