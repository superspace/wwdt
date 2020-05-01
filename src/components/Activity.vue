<template>
    <b-collapse v-model="visible">
        <line-chart height="80" type="line" ref="chart"
            :options="chartOptions" 
            :series="series"></line-chart>
    </b-collapse>
</template>

<script>

import VueApexCharts from "vue-apexcharts"

import { mapState } from 'vuex'

export default {
    name: 'Activity',
    components: {
        lineChart: VueApexCharts
    },
    props: {
        visible: Boolean
    },
    data: function () {
        return {
            // visible: false,
            series: [
            ],
            chartOptions: {
                chart: {
                    type: 'line',
                    height: 80,
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    bar: {
                        columnWidth: '25%',
                    }
                },
                tooltip: {
                    intersect: true,
                    shared: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    labels: {
                        show: false,
                    },
                    axisBorder: {
                        show: false
                    },
                    tooltip: {
                        enabled: false
                    },
                    range: this.duration
                },
                yaxis: {
                    show: false
                },
                colors: [
                    '#007BFF',
                    '#EDEDED'
                ],
                markers: {
                    size: 6,
                    shape: 'square',
                    hover: {
                        size: 8
                    },
                    strokeOpacity: 1,
                    radius: 0,
                    onClick: function (e) {
                        console.log(e); // eslint-disable-line no-console
                    } 
                },
                stroke: {
                    width: 3,
                    curve: 'smooth'
                },
            }
        }
    },
    mounted: function () {
        this.updateSeries()
    },

    computed: {
        ...mapState('marker', ['markers']),
        ...mapState('timeline', ['duration','time']),

        markerData: function () {

            let times = {};

            this.markers.forEach(marker => {
                times[Math.round(marker.time)] = marker
            })

            let data = []
            for (let i = 1; i <= this.duration; i++) {

                if (times[i]) {
                    data.push(times[i].assets.length);
                } else {
                    data.push(0);
                }
            }

            // console.log('Activity::markerData'); // eslint-disable-line no-console

            return data;
        },

        randomData: function () {

            let data = []
            for (let i = 1; i <= this.duration; i+=15) {
                data.push(Math.floor(Math.random()*50)+50);
            }

            return data;
        }
    },
    methods: {
        updateSeries: function () {
            this.series = [
                {
                    name: 'Assets',
                    type: 'line',
                    data: [] //this.markerData
                },
                {
                    name: 'Acitivity',
                    type: 'area',
                    data: this.randomData
                }
            ]
        } 
    },
    watch: {
        duration: function () {
            this.updateSeries()
        },

        markers: {
            deep: true,
            handler: function () {
                this.updateSeries()
            }
        },

        time: function () {
            let chart = this.$refs.chart;            
            chart.chart.toggleDataPointSelection(0, Math.round(this.time-1));
        }
    }
}
</script>

<style lang="scss">

</style>