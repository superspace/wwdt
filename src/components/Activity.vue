<template>         
<div v-if="active">   
    <div class="row">
        <div class="col d-flex justify-content-end">
        <b-form inline class="p-1">
            <b-form-checkbox v-model="showActivity" switch>
            <small>
                <strong>Activity</strong>
            </small>
            </b-form-checkbox>
        </b-form>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <b-collapse v-model="showActivity">
                <line-chart height="80" type="line" ref="chart"
                    :options="chartOptions" 
                    :series="series"></line-chart>
            </b-collapse>
        </div>
    </div>
</div>
</template>

<script>

import VueApexCharts from "vue-apexcharts"

import { mapState, mapGetters } from 'vuex'

export default {
    name: 'Activity',
    components: {
        lineChart: VueApexCharts
    },
    props: {
    },
    data: function () {
        return {
            showActivity: false,
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
                    '#3BC28A',
                    '#EDEDED'
                ],
                markers: {
                    size: 6,
                    shape: 'square',
                    hover: {
                        size: 8
                    },
                    strokeOpacity: 1,
                    radius: 0
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
        ...mapGetters('project', ['sessionMode']),

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

            return this.simplifyData(data)
        },

        randomData: function () {

            let data = []
            for (let i = 1; i <= this.duration; i++) {
                data.push(Math.floor(Math.random()*10)/10 - 0.3);
            }

            return this.simplifyData(data)
        },

        active: function () {
            return this.sessionMode == 'MODE_EDIT' ? true : false

        }

    },
    methods: {
        updateSeries: function () {
            this.series = [
                {
                    name: 'Assets',
                    type: 'line',
                    data: this.markerData
                },
                {
                    name: 'Acitivity',
                    type: 'area',
                    data: this.randomData
                }
            ]
        },
        simplifyData (data) {
        
            const max = 40
            const steps = Math.ceil(data.length/max)

            if (steps == 1)
                return data
            
            let normalized = []
            let sum = 0;
            for (let i = 1; i <= data.length; i++) {
                sum += data[i]
                if (i%steps == 0) {
                    normalized.push(sum)
                    sum = 0
                }
            } 
            return normalized;
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
            if (chart) {
                chart.chart.toggleDataPointSelection(0, Math.round(this.time-1));
            }
        }
    }
}
</script>

<style lang="scss">

</style>