import initDCT from '../initDCT';  // module under test

describe('initDCT() ERRORS', () => {

  describe('initDCT() Schema Issues', () => {

    test('schema required', () => {
      expect( () => initDCT() )
        .toThrow(/schema is required/);
      // THROW: initDCT() parameter violation: schema is required
    });

    test('basic schema type', () => {
      expect( () => initDCT("bad schema type") )
        .toThrow(/schema must be an array of strings/);
      // THROW: initDCT() parameter violation: schema must be an array of strings (context color names)
    });

    test('Empty schema', () => {
      expect( () => initDCT([], {}) )
        .toThrow(/schema must contain at least one context color/);
      // THROW: initDCT() parameter violation: schema must contain at least one context color
    });

    test('bad schema element', () => {
      expect( () => initDCT([123], {}) )
        .toThrow(/invalid schema element.*expecting a string.*string wrapped/);
      // THROW: initDCT() parameter violation: invalid schema element: 123 ... expecting a string -or- a string wrapped in an \"inner\" array ... EX: ['primary', 'secondary', ['error']]
    });

    test('bad schema shaded ContextColor', () => {
      expect( () => initDCT(['context1', ['context2','2nd elm bad']], {}) )
        .toThrow(/shaded contextColor must be a single element/);
      // THROW: initDCT() parameter violation: schema element for shaded contextColor must be a single element \"inner\" array, NOT: 2 element(s) ... EX: ['primary', 'secondary', ['error']]
    });

    test('bad schema shaded ContextColor type', () => {
      expect( () => initDCT(['context1', [123]], {}) )
        .toThrow(/shaded contextColor must be a single element.*array of type string/);
      // THROW: initDCT() parameter violation: schema element for shaded contextColor must be a single element \"inner\" array of type string, NOT: 123 ... EX: ['primary', 'secondary', ['error']]
    });

    test('duplicate schema ContextColor', () => {
      expect( () => initDCT(['context1', 'context1'], {myTheme: {contextColors: {context1: 'red-100'}}}) )
        .toThrow(/schema contains duplicate contextColor.*context1/);
      // THROW: initDCT() parameter violation: schema contains duplicate contextColor: context1"
    });

    test('duplicate schema ContextColor multi-color', () => {
      expect( () => initDCT(['context1', ['context1']], {myTheme: {contextColors: {context1: 'red-100'}}}) )
        .toThrow(/schema contains duplicate contextColor.*context1/);
      // THROW: initDCT() parameter violation: schema contains duplicate contextColor: context1"
    });
  });

  describe('initDCT() Themes Issues', () => {

    test('themes required', () => {
      expect( () => initDCT(['primary']) )
        .toThrow(/themes is required/);
      // THROW: initDCT() parameter violation: themes is required
    });

    test('basic themes type', () => {
      expect( () => initDCT(['primary'], 'bad themes type') )
        .toThrow(/themes must be a JSON structure/);
      // THROW: initDCT() parameter violation: themes must be a JSON structure
    });

    test('empty themes', () => {
      expect( () => initDCT(['primary'], {}) )
        .toThrow(/themes must contain at least one theme/);
      // THROW: initDCT() parameter violation: themes must contain at least one theme
    });

  });

  describe('initDCT() Individual Theme Issues', () => {

    test('basic theme type', () => {
      expect( () => initDCT(['primary'], {myTheme: 'bad theme type'}) )
        .toThrow(/theme:.*myTheme.*must reference a JSON structure/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' must reference a JSON structure
    });

    test('theme missing contextColors', () => {
      expect( () => initDCT(['primary'], {myTheme: {}}) )
        .toThrow(/theme:.*myTheme.*must contain a contextColors property/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' must contain a contextColors property
    });

    test('themes contextColors bad type', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: 'not a JSON struct'}}) )
        .toThrow(/theme:.*myTheme.*contextColors field must reference a JSON structure/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColors field must reference a JSON structure
    });

    test('themes contextColors bad realColor type', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: 123}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*must reference a string-based realColor/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' must reference a string-based realColor
    });

    test('themes contextColor miss-match to schema', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {dillWeed: 'realColor'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*dillWeed.*realColor:.*realColor.*the contextColor is NOT defined in the schema/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'dillWeed' realColor: 'realColor' the contextColor is NOT defined in the schema
    });

    test('themes realColor too many dashes', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: 'too-many-dashes'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*too-many-dashes.*invalid realColor: only a single suffix dash is supported.*for a color shade/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'too-many-dashes' invalid realColor: only a single suffix dash is supported (for a color shade)
    });

    test('themes realColor should reference multi-color', () => {
      expect( () => initDCT([['primary']], {myTheme: {contextColors: {primary: 'red-100'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*red-100.*invalid realColor:.*references a single tailwind shaded color.*schema requires a multi-color/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'red-100' invalid realColor: 
      //        references a single tailwind shaded color (with a dash -), 
      //        but the schema requires a multi-color shaded context color (without a dash)
    });

    test('themes realColor references invalid tailwind color', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: 'bad-100'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*bad-100.*invalid realColor:.*references an invalid tailwind color/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'bad-100' invalid realColor: 
      //        references an invalid tailwind color ... bad does NOT exist"
    });

    test('themes realColor references invalid tailwind color shade', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: 'red-123'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*red-123.*invalid realColor:.*references an invalid tailwind color shade.*123 does NOT exist/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'red-123' invalid realColor: 
      //        references an invalid tailwind color shade ... 123 does NOT exist
    });

    test('themes realColor references single CSS color but requires multi-shaded tailwind color', () => {
      expect( () => initDCT([['primary']], {myTheme: {contextColors: {primary: '#ff33b2'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*#ff33b2.*invalid realColor:.*references a single CSS color.*#ff33b2.*schema requires a multi-color shaded context color.*supplied by a tailwind/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: '#ff33b2' invalid realColor: 
      //        references a single CSS color: '#ff33b2', but the schema requires a multi-color shaded context color (which can only be supplied by a tailwind color)
    });

    test('themes realColor references single tailwind color (black/white) but requires multi-shaded tailwind color', () => {
      expect( () => initDCT([['primary']], {myTheme: {contextColors: {primary: 'black'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*black.*invalid realColor:.*references a single tailwind color.*black.*white.*but the schema requires a multi-color shaded context color/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'black' invalid realColor: 
      //        references a single tailwind color (black/white), but the schema requires a multi-color shaded context color
    });

    test('themes realColor references mulit-shaded tailwind color (without a dash) but requires single-color', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: 'red'}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*red.*invalid realColor:.*references multiple tailwind shaded colors.*schema requires a single-color/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: 'red' invalid realColor: 
      //        references multiple tailwind shaded colors (without a dash -), but the schema requires a single-color non-shaded context color (with a dash)
    });

    test('no content realColor', () => {
      expect( () => initDCT(['primary'], {myTheme: {contextColors: {primary: ' '}}}) )
        .toThrow(/theme:.*myTheme.*contextColor:.*primary.*realColor:.*the realColor has NO content/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' contextColor: 'primary' realColor: '' invalid realColor: the realColor has NO content
    });

    test('missing context colors', () => {
      expect( () => initDCT(['primary', 'secondary', 'dillweed'], {myTheme: {contextColors: {primary: 'red-100'}}}) )
        .toThrow(/theme:.*myTheme.*missing the following context color definitions.*secondary.*dillweed/);
      // THROW: initDCT() parameter violation: theme: 'myTheme' theme is missing the following context color definitions: secondary,dillweed
    });

  });

  describe('initDCT() initial param issues', () => {

    test('initialThemeName NOT string', () => {
      expect( () => initDCT(['primary'], { myTheme: { contextColors: { primary: '#ffb2c3' } } }, 123))
        .toThrow(/initialThemeName.*when supplied.*must be a string/);
      // THROW: initDCT() parameter violation: initialThemeName (when supplied) must be a string
    });

    test('initialThemeName NOT in themes', () => {
      expect( () => initDCT(['primary'], { myTheme: { contextColors: { primary: '#ffb2c3' } } }, 'DillWeed'))
        .toThrow(/initialThemeName.*DillWeed.*IS NOT defined in themes/);
      // THROW: initDCT() parameter violation: supplied initialThemeName: 'DillWeed' IS NOT defined in themes
    });

    test('initialInvertShade NOT boolean', () => {
      expect( () => initDCT(['primary'], { myTheme: { contextColors: { primary: '#ffb2c3' } } }, 'myTheme', 123))
        .toThrow(/initialInvertShade.*when supplied.*must be a boolean/);
      // THROW: initDCT() parameter violation: initialInvertShade (when supplied) must be a boolean
    });

  });


  describe('DCT.activateTheme() issues', () => {

    const DCT = initDCT(['primary'], { myTheme: { contextColors: { primary: '#ffb2c3' } } });

    test('themeName NOT string', () => {
      expect( () => DCT.activateTheme({themeName:123}))
        .toThrow(/themeName.*when supplied.*must be a string/);
      // THROW: activateTheme() parameter violation: themeName (when supplied) must be a string
    });

    test('themeName NOT in themes', () => {
      expect( () => DCT.activateTheme({themeName: 'DillWeed'}))
        .toThrow(/supplied themeName.*DillWeed.*IS NOT defined in themes/);
      // THROW: activateTheme() parameter violation: supplied themeName: 'DillWeed' IS NOT defined in themes
    });

    test('invertShade NOT boolean', () => {
      expect( () => DCT.activateTheme({themeName: 'myTheme', invertShade: 123}))
        .toThrow(/invertShade.*when supplied.*must be a boolean/);
      // THROW: activateTheme() parameter violation: invertShade (when supplied) must be a boolean
    });

    test('unrecognized named parameter', () => {
      expect( () => DCT.activateTheme({themeName: 'myTheme', invertShade: true, oops: 'bad param', doodle: 'another bad param'}))
        .toThrow(/unrecognized named parameter.*oops.*doodle/);
      // THROW: activateTheme() parameter violation: unrecognized named parameter(s): oops,doodle
    });

    test('bad positional parameter', () => {
      expect( () => DCT.activateTheme({themeName: 'myTheme', invertShade: true}, 123))
        .toThrow(/unrecognized positional parameter.*only named parameters may be specified.*2 positional parameters were found/);
      // THROW: activateTheme() parameter violation: unrecognized positional parameters (only named parameters may be specified) ... 2 positional parameters were found"
    });

    test('bad named parameters', () => {
      expect( () => DCT.activateTheme(123))
        .toThrow(/uses named parameters/);
      // THROW: activateTheme() parameter violation: uses named parameters (check the API)
    });

  });

});
