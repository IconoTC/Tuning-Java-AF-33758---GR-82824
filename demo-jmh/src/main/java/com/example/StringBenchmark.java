package com.example;

import java.util.concurrent.TimeUnit;

import org.openjdk.jmh.annotations.Benchmark;
import org.openjdk.jmh.annotations.BenchmarkMode;
import org.openjdk.jmh.annotations.CompilerControl;
import org.openjdk.jmh.annotations.Fork;
import org.openjdk.jmh.annotations.Measurement;
import org.openjdk.jmh.annotations.Mode;
import org.openjdk.jmh.annotations.Param;
import org.openjdk.jmh.annotations.Scope;
import org.openjdk.jmh.annotations.State;
import org.openjdk.jmh.annotations.Warmup;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

@BenchmarkMode(Mode.Throughput)
@Warmup(time = 1, timeUnit = TimeUnit.SECONDS, iterations = 1)
@Measurement(time = 1, timeUnit = TimeUnit.SECONDS, iterations = 3)
@State(Scope.Benchmark)
@Fork(2)
public class StringBenchmark {
    public static class StringHelper {

        @CompilerControl(CompilerControl.Mode.INLINE)
        public static String repeatWithPlus(String seed, int count) {
            String result = "";
            for (int i = 0; i < count; i++) {
                result += seed;
            }
            return result;
        }

        public static String repeatWithConcat(String seed, int count) {
            String result = "";
            for (int i = 0; i < count; i++) {
                result = result.concat(seed);
            }
            return result;
        }

        public static String repeatWithStringBuilder(String seed, int count) {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < count; i++) {
                result.append(seed);
            }
            return result.toString();
        }

        public static String repeatWithStringBuffer(String seed, int count) {
            StringBuffer result = new StringBuffer();
            for (int i = 0; i < count; i++) {
                result.append(seed);
            }
            return result.toString();
        }

    }

    @Param({ "10", "100", "1000" })
    int size = 10;

    @Param({ ".", "1234567890" })
    String source = ".";

    @Benchmark
    public String testRepeatWithPlus() {
        return StringHelper.repeatWithPlus(source, size);
    }

    @Benchmark
    public String testRepeatWithConcat() {
        return StringHelper.repeatWithConcat(source, size);
    }

    @Benchmark
    public String testRepeatWithStringBuilder() {
        return StringHelper.repeatWithStringBuilder(source, size);
    }

    @Benchmark
    public String testRepeatWithStringBuffer() {
        return StringHelper.repeatWithStringBuffer(source, size);
    }

    public static void main(String[] args) throws RunnerException {
        Options opt = new OptionsBuilder()
                .include(StringBenchmark.class.getSimpleName())
                .forks(1)
                .build();

        new Runner(opt).run();
    }
}
