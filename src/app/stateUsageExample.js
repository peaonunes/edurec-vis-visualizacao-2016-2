import { actionCreators as schoolActions } from './state/actions/schools';

export default function(store) {
  const schoolA = {
    nome: 'escola A',
    _id: 'A',
    fieldA: true,
    fieldB: false
  };
  store.dispatch(schoolActions.addSchool(schoolA));

  const schoolB = {
    nome: 'escola B',
    _id: 'B',
    fieldA: false,
    fieldB: true
  };
  store.dispatch(schoolActions.addSchool(schoolB));

  const students = [
    {
      _id: '1',
      escola: 'A',
      foo: 'bar',
    },
    {
      _id: '2',
      escola: 'A',
      foo: 'baz',
    },
    {
      _id: '3',
      escola: 'A',
      foo: 'qux',
    },
    {
      _id: '4',
      escola: 'B',
      foo: 'bar',
    },
    {
      _id: '5',
      escola: 'B',
      foo: 'baz',
    },
    {
      _id: '6',
      escola: 'B',
      foo: 'qux',
    }
  ];
  students.forEach((student) => {
    store.dispatch(schoolActions.addStudent(student.escola, student));
  });
}