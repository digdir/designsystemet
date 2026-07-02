async function bootstrap() {
  if (figma.editorType === 'figma') {
    figma.showUI(__html__, {
      width: 800,
      height: 650,
      title: 'My Figma Plugin!',
    });
  }

  console.log('Hello world from the plugin code!');
}

bootstrap();
