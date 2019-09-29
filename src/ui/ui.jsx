import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import { emit, subscribe } from '../eventBus'

const Layout = styled.div`
  height: 100vh;
  width: 100vw;

  position: absolute;
  top: 0;
  left: 0;

  display: grid;
  grid-template: 1fr / 1fr 300px;
`

const Sidebar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  grid-area: 1/2;
  overflow: auto;
`

const TwoAreaInformationWrapper = styled.div`
  display: grid;
  grid-template: 1fr / 1fr 1fr;
`

const Column = styled.div`
  display: grid;
  grid-area: ${props => props.area};
`

const AreaInformation = ({ data }) => (
  <div>
    <img src={data.image.url} />
    <h2>{data.name}</h2>
    <p>size: {data.size}</p>

    <div>
      {data.units.map(unitId => (
        <button type="button" key={unitId}>
          <img src={unitId} />
        </button>
      ))}
    </div>
  </div>
)
const TwoAreaInformation = ({ firstArea, secondArea }) => (
  <TwoAreaInformationWrapper>
    <Column area="1/1">
      <img src={firstArea.image.url} />
      <h2>{firstArea.name}</h2>
      <p>{firstArea.size}</p>

      <div>
        {firstArea.units.map(unitId => (
          <button type="button" key={unitId}>
            <img src={unitId} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          emit('moveUnits', {
            units: firstArea.units,
            area: secondArea.id,
          })
        }
      >
        -->
      </button>
    </Column>
    <Column area="1/2">
      <img src={secondArea.image.url} />
      <h2>{secondArea.name}</h2>
      <p>{secondArea.size}</p>

      <div>
        {secondArea.units.map(unitId => (
          <button type="button" key={unitId}>
            <img src={unitId} />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          emit('moveUnits', {
            units: secondArea.units,
            area: firstArea.id,
          })
        }
      >
        {'<--'}
      </button>
    </Column>
  </TwoAreaInformationWrapper>
)

function App() {
  const [areaData, setAreaData] = useState(null)
  const [twoAreaData, setTwoAreaData] = useState(null)

  useEffect(() => {
    const { unsubscribe } = subscribe('displayAreaData', data => {
      setAreaData(data)
      setTwoAreaData(null)
    })
    return unsubscribe
  })

  useEffect(() => {
    const { unsubscribe } = subscribe('displayTwoAreaData', setTwoAreaData)
    return unsubscribe
  })

  return (
    <Layout>
      <Sidebar>
        {!twoAreaData && areaData && <AreaInformation data={areaData} />}
        {twoAreaData && (
          <TwoAreaInformation
            firstArea={twoAreaData.firstArea}
            secondArea={twoAreaData.secondArea}
          />
        )}
      </Sidebar>
    </Layout>
  )
}

const rootElement = document.getElementById('app')
render(<App />, rootElement)
