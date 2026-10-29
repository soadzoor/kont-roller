package com.soadzoor.build;
import org.junit.Test;
import org.objectweb.asm.*;
import java.util.*;
import static org.junit.Assert.*;
public class ReactNativeWindowVisitorTest {
    private byte[] fixture(boolean allHelpers) {
        ClassWriter writer = new ClassWriter(0);
        writer.visit(Opcodes.V1_8, Opcodes.ACC_PUBLIC, "com/facebook/react/views/view/WindowUtilKt", null, "java/lang/Object", null);
        String[] names = allHelpers ? new String[]{"enableEdgeToEdge","statusBarHide","statusBarShow","unrelated"} : new String[]{"enableEdgeToEdge"};
        for (String name : names) {
            MethodVisitor method=writer.visitMethod(Opcodes.ACC_PUBLIC|Opcodes.ACC_STATIC,name,"(Landroid/view/Window;)V",null,null);
            method.visitCode(); method.visitInsn(Opcodes.RETURN); method.visitMaxs(0,1); method.visitEnd();
        }
        writer.visitEnd(); return writer.toByteArray();
    }
    @Test public void redirectsExactlyTheThreeWindowHelpers() {
        ClassWriter output=new ClassWriter(0);
        new ClassReader(fixture(true)).accept(new ReactNativeWindowVisitor(output),0);
        Map<String,String> calls=new HashMap<>(); Set<String> methods=new HashSet<>();
        new ClassReader(output.toByteArray()).accept(new ClassVisitor(Opcodes.ASM9) {
            @Override public MethodVisitor visitMethod(int access,String name,String desc,String sig,String[] exceptions) {
                methods.add(name);
                return new MethodVisitor(Opcodes.ASM9) {
                    @Override public void visitMethodInsn(int opcode,String owner,String target,String descriptor,boolean isInterface) {
                        calls.put(name,owner+"."+target);
                    }
                };
            }
        },0);
        assertEquals(4,methods.size()); assertEquals(3,calls.size());
        for(String name:new String[]{"enableEdgeToEdge","statusBarHide","statusBarShow"})
            assertEquals("com/soadzoor/kontroller/SystemBarsCompat."+name,calls.get(name));
        assertFalse(calls.containsKey("unrelated"));
    }
    @Test(expected=IllegalStateException.class) public void stopsTheBuildIfAnUpstreamHelperDisappears() {
        new ClassReader(fixture(false)).accept(new ReactNativeWindowVisitor(new ClassWriter(0)),0);
    }
}
