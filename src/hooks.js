import { useRef, useEffect, useMemo, useState } from 'react';
import { Machine } from 'xstate';

const usePrevious = value => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const useFlow = ({ config }) => {
  const stateMachine = useMemo(() => Machine(config), [config]);

  const getInitialState = () =>
    stateMachine.transition(stateMachine.initial, '');

  const [flowState, setFlowState] = useState(getInitialState);

  console.log('flowState', flowState);

  const transition = (evt, data) => {
    const nextFlowState = stateMachine.transition(flowState, evt);
    nextFlowState.data = data;
    setFlowState(nextFlowState);
  };

  useEffect(() => {}, [flowState]);

  return { flowState, transition, stateMachine };
};

const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const handleChange = e => {
    setValue(e.target.value);
  };
  return [value, handleChange];
};

export { useFlow, useInput, usePrevious };
