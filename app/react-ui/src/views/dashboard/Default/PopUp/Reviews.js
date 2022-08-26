import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';

// Generate Order Data
function createData(id, stars, date, text, useful) {
  return { 'id' : {'raw': id}, 'stars' : {'raw': stars}, 'date' : {'raw': date}, 'text' : {'raw': text}, 'useful' : {'raw': useful}};
}

function preventDefault(event) {
  event.preventDefault();
}

const Reviews = ({data}) => {
  let rows = []
  if(data == null){
    rows = [ createData(
      0,
      4,
      '2016-03-09',
      "Great place to hang out after work: the prices are decent, and the ambience is fun. It's a bit loud, but very lively. The staff is friendly, and the food is good. They have a good selection of drinks.",
      0,
    )
    ];
  }
  else{
    rows = data.reviews
  }
  return (
    <React.Fragment>
      <Title>Reviews</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Stars</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Useful</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id.raw}>
              <TableCell>{row.stars.raw}</TableCell>
              <TableCell>{row.date.raw}</TableCell>
              <TableCell>{row.text.raw}</TableCell>
              <TableCell>{row.useful.raw}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default Reviews;
