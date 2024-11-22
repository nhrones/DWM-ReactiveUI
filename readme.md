# DWM_ReactiveUI

# DDRF

## A Deno Desktop ReactiveUI Framework 

## No Browser!  
## No WebView! 
## No WebUI! 
Just a cross-platform native desktop window!


<br/>

## Warning: POC-WIP project
The purpose of this _Proof-Of-Concept_ project is to test the validity of a _Deno-Window-Manager Graphical-User-Interface_ framework; proving that the proposed framework can work in real life examples.

<br/>

This is a _Work-In-Progress hobby-project_, and is in no way ready for production. You should expect constant-change while I play with the design and implementation.

<br/>

## Framework
This experimental UI framework leverages both _Deno Window Manager_ and a _skia-canvas_ to render a _Retained-Mode Graphical User Iinterface_.  All UI is rendered directly to the skia-canvas.  
https://github.com/deno-windowing/dwm    
https://github.com/DjDeveloperr/skia_canvas 

Unlike Microsofts WPF and Silverlights use of _code-behind_ files, DWM_ReactiveUI uses an MVVM framework where _code-behind_ is replaced by decoupled _Viewmodels_. 
<br/>

The most unique aspect of this framework is the complete decoupling of Views, ViewModels, as well as the framewor, by way of a common, strongly-typed, synchronous event-bus.
 
<br/>

# Examples

## Dice game example
To run the Dice-Game example, with Deno installed, run:
```
deno run -A --unstable https://raw.githubusercontent.com/nhrones/DWM-ReactiveUI/main/Examples/DiceGame/main.ts
```
 
<br/>

## Editable Text Area example
To run the multi-line text example, with Deno installed, run:
```
deno run -A --unstable https://raw.githubusercontent.com/nhrones/DWM-ReactiveUI/main/Examples/TextArea/main.ts
```
 
<br/>

## Documentation
https://dwm-reactiveUI-docs.deno.dev/
 
<br/>

 
<br/>
