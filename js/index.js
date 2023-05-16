let svgBorderInstance = 0;

Vue.component('SvgBorder', {
    data() {
        svgBorderInstance++;
        return {
            rect: {},
            clipPathId: `svg-border-cp-${svgBorderInstance}`,
        };
    },
    template: `
    <svg 
        class="svg-border" 
        :viewBox="viewBox" 
        :width="width"
        :height="height"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        stroke-width="2">
        <clipPath :id="clipPathId">
            <path :d="path" />
        </clipPath>
        <path 
            :clip-path="'url(#' + clipPathId + ')'" 
            :d="path" 
            fill="none"
            pathLength="100" />
    </svg>
    `,
    methods: {
        getRect() {
            this.rect = (this.$el && this.$el.parentNode && this.$el.parentNode.getBoundingClientRect()) || {};
        },
    },
    computed: {
        width() {
            const { width = 0 } = this.rect;
            return Math.round(width);
        },
        height() {
            const { height = 0 } = this.rect;
            return Math.round(height);
        },
        viewBox() {
            return `0 0 ${this.width} ${this.height}`;
        },
        path() {
            const { width: w, height: h } = this;

            return [
                `M ${w/2} ${h}`,
                `h ${(w-h)/2}`,
                `a ${h/2} ${h/2} 0 1 0 0 ${h*-1}`,
                `h ${(w-h)*-1}`,
                `a ${h/2} ${h/2} 0 1 0 0 ${h}`,
                `h ${(w-h)/2}`,
            ].join(' ');
        },
    },
    mounted() {
        this.$nextTick(this.getRect.bind(this));

        ['load', 'DOMContentLoaded', 'resize', 'orientationchange']
        .map(evName => (window.addEventListener(evName, debounce(this.getRect.bind(this), 1000))));
    }
});

Vue.component('Navigation', {
    data() {
        return { active: null };
    },
    props: {
        links: Array
    },
    template: `
    <nav class="nav">
        <a
            v-for="({url, label}, index) in links" 
            :href="url" class="nav-item" :class="{'is-active': active === index}"
            @click.prevent="active = index"
            :id="label">
            <SvgBorder></SvgBorder>
            <SvgBorder></SvgBorder>
            {{label}}
        </a>
    </nav>
    `,
    mounted() {
        setTimeout(() => (this.active = 0), 1000);
    },
});

window.onload = function() {
    const header = new Vue({
        el: '#header',
        data() {
            return {
                navLinks: ['Portfolio', 'About', 'Contact', 'Resume']
                    .map(label => ({ url: '#', label })),
            }
        },
    });
}

$(document).ready(function() {
    $('#topBtn').click(function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('#Portfolio').click(function() {
        window.location.href = "index.html";
    });

    $('#About').click(function() {
        window.location.href = "aboutMe.html";
    });
});