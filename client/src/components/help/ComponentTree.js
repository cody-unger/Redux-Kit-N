import React from 'react';

export default (
  <div>
    Items listed in this section will be a visual representation of the component
    render tree of the application you are building!            <b>App</b> serves as the ‘root’ of
    your application anything <b>App</b> renders directly will be indented once.
    Descendants of those subcomponents will follow that convention and be indented
    once more than their immediate parents.
    <br />
    <br />

    Hovering over a component in the app tree will do two things:
    <ol>
      <li>Two tool buttons will appear, a link icon and an edit icon.
        <ul>
          <li>
            The link icon will connect or disconnect that component to the store,
            allowing it to pull the properties it and/or it’s children need.
          </li>
          <li>
            The edit icon will bring up the <b>Edit App Wizard</b>, which will allow
            you to specify the actions and properties(store and inherited).
          </li>
        </ul>
      </li>
      <li>
        Additionally a tooltip will appear under that will tell you the props and
        actions assigned to that component.
      </li>
    </ol>
  </div>
);
