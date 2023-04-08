import React, { Component } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

interface ChartProps {
  projectTags: any;
}

interface ChartState {
  chartData: FrameData[];
}

type FrameData = {time: number;
  [key: string]: number;};

const colours = ["#8884d8", "#82ca9d", "#ffc658"];

export default class Chart extends Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);
    this.state = {
      chartData: []
    };
  }
  
  setChartData(confidence: number, data:any) {
    if (data == null || data == undefined) {
      return;
    }
    const chartData: FrameData[] = [];
    Object.keys(data).forEach(timestamp => {
      const frame: FrameData = {time: Number(timestamp)};

      for (const annotation of data[timestamp]) {
        if (annotation.confidence < confidence) {
          continue;
        }
        if (!frame[annotation.tag.name]) {
          frame[annotation.tag.name] = 1;
        } else {
          frame[annotation.tag.name]++;
        }
      }
      if (Object.keys(frame).length > 1) {
        chartData.push(frame);
      }
    })
    this.setState({
      chartData: chartData
    })
  };
  
  
  render() {
    return(
      <>
        <AreaChart width={700} height={110} data={this.state.chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <XAxis dataKey="time" />
          <YAxis hide={this.state.chartData.length == 0}/>
          <CartesianGrid vertical={false} horizontal={false} />
          <Tooltip />
          {Object.keys(this.props.projectTags).map((tagname, idx) => {            
            return (
              <Area type="monotone" dataKey={tagname} stackId="1" stroke={colours[idx%3]} fill={colours[idx%3]} />
            );
          })}
        </AreaChart>
      </>
    );
  }
}
