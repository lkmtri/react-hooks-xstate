import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { useFlow, useInput, usePrevious } from './hooks';

const chooser = (...args) => console.log('enter', ...args);

const subLoginFlow = {
  initial: 'AccountChooser',
  states: {
    AccountChooser: {
      on: {
        NEXT: [
          { target: 'LogIn', cond: (_, evtObj) => evtObj.login },
          { target: 'AcountChooser' }
        ]
      }
    },
    LogIn: {
      on: {
        PREV: 'AccountChooser',
        NEXT: {
          target: 'PasswordReset',
          cond: (_, evtObj) => evtObj.resetPassword
        }
      }
    },
    SignUp: {
      on: {
        PREV: 'AccountChooser'
      }
    },
    PasswordReset: {
      on: {
        BACK: 'Login'
      }
    }
  }
};

const orderingFlow = {
  initial: 'DeliveryPickupSelection',
  states: {
    DeliveryPickupSelection: {
      on: {
        NEXT: [
          { target: 'Delivery', cond: (_, evtObj) => evtObj.delivery },
          { target: 'Pickup' }
        ],
        LOGIN: {
          target: 'login'
        }
      }
    }
  }
};

const loginFlow = {
  initial: 'login',
  states: {
    login: subLoginFlow
  }
};

function useDelayedTransition(flow) {
  const { flowState, ...flowProps } = useFlow({ config: flow });
  const prevFlowState = usePrevious(flowState);
  useEffect(
    () => {
      console.log('prev', prevFlowState);
      console.log('current', flowState);
    },
    [flowState]
  );
  return { flowState, ...flowProps };
}

function useLoginFlow() {
  return {
    loginFlow: useDelayedTransition(loginFlow)
  };
}

function App() {
  const { loginFlow } = useLoginFlow();
  const [value, onChange] = useInput();
  const [data, onDataChange] = useInput();
  return (
    <div className="App">
      <p>{JSON.stringify(loginFlow.flowState.value)}</p>
      <form onSubmit={e => e.preventDefault()}>
        <input value={value} onChange={onChange} />
        <input value={data} onChange={onDataChange} />
        <button
          type="submit"
          onClick={() => loginFlow.transition({ type: value, data })}
        >
          Click
        </button>
      </form>
      <button onClick={() => loginFlow.start({ data: 'asdfasdf' })}>
        Start
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
