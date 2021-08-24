/** This is a (kindof) Singleton class. The purpose of this is to handle some frequently used HTML/CSS manipulations */

export class HTMLUtils
{
	public static addToClassList(elements: HTMLCollectionOf<Element>, className: string)
	{
		for (let i = 0; i < elements.length; ++i)
		{
			elements[i].classList.add(className);
		}
	}

	public static getSize(element: Element)
	{
		return element.getBoundingClientRect();
	}

	public static removeFromClassList(elements: HTMLCollectionOf<Element> | NodeListOf<Element>, className: string)
	{
		for (let i = 0; i < elements.length; ++i)
		{
			elements[i].classList.remove(className);
		}
	}

	public static addListenerToHTMLElements(elements: HTMLCollectionOf<Element>, type: string, listener: () => any)
	{
		for (let i = 0; i < elements.length; ++i)
		{
			elements[i].addEventListener(type, listener);
		}
	}

	public static removeListenerFromHTMLElements(elements: HTMLCollectionOf<Element>, type: string, listener: () => any)
	{
		for (let i = 0; i < elements.length; ++i)
		{
			elements[i].removeEventListener(type, listener);
		}
	}

	public static detach(element: HTMLElement | SVGElement)
	{
		if (element.parentElement)
		{
			element.parentElement.removeChild(element);
		}
	}

	public static clearElement(element: HTMLElement)
	{
		while (element.firstChild)
		{
			element.removeChild(element.firstChild);
		}
	}

	public static hideElement(element: HTMLElement)
	{
		element.style.display = "none";
	}

	public static showElement(element: HTMLElement, isHiddenByDefault: boolean = false)
	{
		element.style.display = isHiddenByDefault ? "block" : "";
	}

	public static isElementChildOfElement(element: Element, parent: Element): boolean
	{
		return parent.contains(element);
	}
}