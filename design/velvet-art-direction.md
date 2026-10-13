# Myrakal / Velvet and pearl

Built-in image generation was used for the four raster assets below. Original generated PNGs remain in the local generated-images library. Project images are WebP copies, resized without changing the compositions; alpha is preserved for the Rod and falling velvet. The interactive Rod is a separate procedural Three.js model.

Three.js 0.180.0 is deliberately added for genuine 3D rotation, physically lit pearl/platinum materials, and pointer/keyboard interaction. It loads dynamically behind the fallback photograph; the initial HTML/CSS scene remains readable while it loads. Geometry, environment maps, listeners and animation frames are disposed on unmount, and automatic rendering stops offscreen or with reduced motion.

Vitest is pinned to the earlier stable patch 5.0.3 because the existing 5.0.4 lockfile entries were published within the configured minimum release age and blocked installation. Registry publication dates and package integrity were checked; the release-age policy remains enabled. This pin allows a reproducible install of the renderer without relaxing the repository's supply-chain checks.

## Saved project assets

- `public/images/velvet-scene.webp`: cinematic hero fabric backdrop.
- `public/images/velvet-drape.webp`: transparent drape across the section boundary.
- `public/images/pearl-rod.webp`: transparent loading/WebGL fallback.
- `public/images/care-object.webp`: larger copy of the pearl jewelry photograph for the magazine cover.
- `public/images/journey-object.webp`: silver-compass travel still life.

## Generation prompts

### Velvet scene

Use case: product-mockup. Asset type: website cinematic hero background, wide landscape 3:2. Use the attached perfume photograph as a composition and fabric-lighting reference only. Create a photorealistic floating fabric installation, no perfume and no object in the center. Deep Myrakal oxblood velvet fabric #4d0f1a with realistic soft silk-velvet sheen, richly lit wine-red folds. A long draped ribbon sweeps from upper left, billows down along the left and lower frame, with another large soft fold at the far right edge. Backdrop is very dark wine #2e0810. Leave generous clean dark negative space centrally and on the right for a separate spinning jewelry sculpture and readable text. Dramatic soft studio lighting, tactile fibers, expensive luxury jewelry campaign atmosphere, airy sculptural movement, photographed rather than illustration. No people, no text, no jewelry, no bottle, no logos, no stars or particles.

### Falling velvet

Use case: product-mockup. Asset type: transparent website overlay. A single long photographic ribbon of lustrous deep oxblood velvet #4d0f1a suspended in air, sweeping horizontally from left to right with a thick graceful falling U-shaped swag in the middle and right, flowing folds with a free curled lower edge. Luxury fabric campaign photography, warm softbox light revealing wine-red pile and dark burgundy folds. Wide 3:1 composition, all the fabric fully in frame, generous transparent margin. Real transparent background, isolated cutout; no flat rectangular background, no backdrop, no people, no text, no props.

### Pearl Rod

Use case: product-mockup. Asset type: isolated transparent luxury jewelry sculpture for website and editorial poster. One accurate Rod of Asclepius: a single slender polished pearl-white silver staff, exactly ONE serpent winding around it in three flowing coils, no wings, no second snake. A beautifully defined elegant serpent head at the top of the coils. Sculptural fine designer jewelry, nacre/creamy pearl finish with delicate polished platinum edges and tiny pearl inlays, luminous glossy specular highlights and subtle organic nacre iridescence. Tall slender rod with a round pearl finial, slight 12 degree tilt, three-quarter view. Exceptional luxury jewelry product photography with softbox reflections, fully in frame generous margins and genuine transparent background. No typography, no logos, no additional objects, no stethoscope, no people. Elegant heirloom rather than cartoon snake.

### Journey still life

Use case: product-mockup. Asset type: vertical magazine cover photograph, 2:3. Luxury editorial travel still life, no people: one exquisite vintage polished silver compass with a cream face resting on sculpturally folded unprinted cream papers and a small smooth pearl stone, arranged on a warm ivory travertine surface. A narrow oxblood velvet ribbon crosses bottom foreground. Strong sculptural late-afternoon sunlight and deep diagonal shadows, quiet couture campaign aesthetic, tactile paper and stone, subtle fine grain, premium photography. Compass and papers in bottom two thirds; upper third quiet pale cream negative space for an HTML magazine title. No text whatsoever, no numbers, no brands, no passport, no documents with personal details, no map, no random objects, no human body parts. Colors cream #f6eee4, pearl and silver with an oxblood accent.
