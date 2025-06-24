
'use client';

import { schoolList } from '@/data/school-list';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface DocumentProps {
  data: {
    applicationNo: string;
    candidateName: string;
    fatherName: string;
    category: string;
    gender: string;
    domicile: string;
  };
}

export function SchoolPriorityListDocument({ data }: DocumentProps) {
  const list_part_1 = schoolList.slice(0, 41);
  const list_part_2 = schoolList.slice(41);

  return (
    <div className="bg-white text-black p-4 space-y-4 font-sans text-xs">
        {/* Document 1 */}
      <div className="border border-black p-2">
        <div className="text-center mb-2">
          <p className="font-bold">ALL INDIA SAINIK SCHOOLS ADMISSION COUNSELLING</p>
          <p className="font-bold underline">PRIORITY LIST OF SCHOOL</p>
        </div>
        <Table className="border-collapse border border-black">
          <TableBody>
            <TableRow>
              <TableCell className="border border-black p-1">Application No :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.applicationNo}</TableCell>
              <TableCell className="border border-black p-1">Candidate Name :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.candidateName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1">Father Name :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.fatherName}</TableCell>
              <TableCell className="border border-black p-1">Category :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.category}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="border border-black p-1">Gender :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.gender}</TableCell>
              <TableCell className="border border-black p-1">Domicile :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.domicile}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="border-collapse border border-black mt-2 w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="border border-black p-1 text-black font-bold w-[15%]">Priority</TableHead>
                    <TableHead className="border border-black p-1 text-black font-bold">School Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list_part_1.map((school, index) => (
                    <TableRow key={index}>
                        <TableCell className="border border-black p-1 text-center">{index + 1}</TableCell>
                        <TableCell className="border border-black p-1">{school}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-2 text-xs">
            <p className="font-semibold">{data.applicationNo}</p>
            <p className="font-semibold">Page 1</p>
            <p className="font-semibold">22-06-2025</p>
        </div>
      </div>
      
        {/* Document 2 */}
       <div className="border border-black p-2">
        <div className="text-center mb-2">
          <p className="font-bold">ALL INDIA SAINIK SCHOOLS ADMISSION COUNSELLING</p>
          <p className="font-bold underline">PRIORITY LIST OF SCHOOL</p>
        </div>
        <Table className="border-collapse border border-black">
          <TableBody>
            <TableRow>
              <TableCell className="border border-black p-1">Application No :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.applicationNo}</TableCell>
              <TableCell className="border border-black p-1">Candidate Name :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.candidateName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1">Father Name :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.fatherName}</TableCell>
              <TableCell className="border border-black p-1">Category :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.category}</TableCell>
            </TableRow>
             <TableRow>
              <TableCell className="border border-black p-1">Gender :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.gender}</TableCell>
              <TableCell className="border border-black p-1">Domicile :</TableCell>
              <TableCell className="border border-black p-1 font-semibold">{data.domicile}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table className="border-collapse border border-black mt-2 w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="border border-black p-1 text-black font-bold w-[15%]">Priority</TableHead>
                    <TableHead className="border border-black p-1 text-black font-bold">School Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {list_part_2.map((school, index) => (
                    <TableRow key={index}>
                        <TableCell className="border border-black p-1 text-center">{index + 42}</TableCell>
                        <TableCell className="border border-black p-1">{school}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className="flex justify-between items-center mt-2 text-xs">
            <p className="font-semibold">{data.applicationNo}</p>
            <p className="font-semibold">Page 2</p>
            <p className="font-semibold">22-06-2025</p>
        </div>
      </div>
    </div>
  );
}
